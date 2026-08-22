import styled from '@emotion/styled';
import { colors } from '../theme';
import { Button } from './ui';

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.bg};
  color: ${colors.text};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  padding: 24px;
`;

const Card = styled.div`
  max-width: 480px;
  text-align: center;
`;

const Code = styled.p`
  margin: 0;
  font-size: 84px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
  color: ${colors.primary};
`;

const Title = styled.h1`
  margin: 18px 0 10px;
  font-size: 24px;
  font-weight: 800;
  color: ${colors.navy};
`;

const Body = styled.p`
  margin: 0 0 26px;
  font-size: 15.5px;
  line-height: 1.65;
  color: ${colors.muted};
`;

export default function NotFound() {
  return (
    <Page>
      <Card>
        <Code>404</Code>
        <Title>This page doesn’t exist.</Title>
        <Body>
          The link may be old or mistyped — everything you need is on the home page.
        </Body>
        <Button href="/" variant="primary">
          Back to BrightGuard
        </Button>
      </Card>
    </Page>
  );
}
