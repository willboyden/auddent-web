#!/usr/bin/env bash
# Deploy-freshness gate for the marketing-site container (same pattern as the
# root start-docker.sh): stamp the repo HEAD into the image (COMMIT ->
# `org.opencontainers.image.revision` label) and refuse to boot an image
# whose stamp does not match HEAD.
#
#   ./start.sh            rebuild when stale, then `docker compose up -d`
#   ./start.sh --no-rebuild
#                         same, but a stale/missing image is a hard error
#                         (exit 1) instead of a rebuild
set -euo pipefail
cd "$(dirname "$0")"

IMAGE="auditdent-site:local"
LABEL="org.opencontainers.image.revision"
NO_REBUILD=0
if [[ "${1:-}" == "--no-rebuild" ]]; then
  NO_REBUILD=1
fi

HEAD_SHA="$(git rev-parse HEAD 2>/dev/null || echo no-git)"

image_stamp() {
  # The `if` keeps this from erroring on pre-stamp images with no labels.
  docker image inspect --format \
    '{{if .Config.Labels}}{{index .Config.Labels "'"${LABEL}"'"}}{{end}}' "$IMAGE" 2>/dev/null || true
}

CURRENT_SHA="$(image_stamp)"
echo "repo HEAD:   ${HEAD_SHA}"
echo "image stamp: ${CURRENT_SHA:-<no stamp>}"

if [[ -n "$CURRENT_SHA" && "$CURRENT_SHA" == "$HEAD_SHA" ]]; then
  echo "image is current — skipping rebuild"
else
  if [[ $NO_REBUILD == 1 ]]; then
    {
      echo "REFUSING to boot: image ${IMAGE} is stale or missing."
      echo "  image stamp ${CURRENT_SHA:-<none>} != repo HEAD ${HEAD_SHA}"
      echo "  rebuild with:  $0   (without --no-rebuild)"
    } >&2
    exit 1
  fi
  echo "stale or missing image — rebuilding with BUILD_SHA=${HEAD_SHA}"
  export BUILD_SHA="$HEAD_SHA"
  docker compose build
  unset BUILD_SHA
fi

docker compose up -d
echo "up: http://127.0.0.1:8090 (image stamp: $(image_stamp))"
