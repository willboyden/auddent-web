import styled from '@emotion/styled';
import { colors, radii, shadows } from '../theme';
import { COMPARE_COLUMNS, COMPARE_ROWS } from '../data/content';
import type { CompareCell } from '../data/content';
import { Button, CheckIcon, Container, Section, SectionHeading, SrOnly } from './ui';

const TableScroll = styled.div`
  overflow-x: auto;
  background: #ffffff;
  border: 1px solid ${colors.border};
  border-radius: ${radii.lg}px;
  box-shadow: ${shadows.card};

  &:focus-visible {
    outline: 3px solid rgba(10, 99, 201, 0.45);
    outline-offset: 2px;
  }
`;

const Table = styled.table`
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
  font-size: 14px;
`;

const RowHeader = styled.th`
  text-align: left;
  vertical-align: top;
  padding: 15px 18px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.45;
  color: ${colors.navy};
  border-bottom: 1px solid ${colors.border};
`;

const HeadCell = styled.th<{ featured?: boolean }>`
  text-align: left;
  vertical-align: bottom;
  padding: 14px 18px;
  font-size: 14.5px;
  font-weight: 700;
  line-height: 1.35;
  color: ${colors.navy};
  background: ${({ featured }) => (featured ? colors.greenBg : '#f5f8fc')};
  border-bottom: 1px solid ${colors.border};
`;

const BodyCell = styled.td<{ featured?: boolean }>`
  vertical-align: top;
  padding: 15px 18px;
  border-bottom: 1px solid ${colors.border};
  background: ${({ featured }) => (featured ? '#eef8f2' : 'transparent')};
`;

const CellInner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 9px;
  font-size: 13.5px;
  line-height: 1.5;
  color: ${colors.muted};
`;

const NoIcon = styled.svg`
  flex-shrink: 0;
  margin-top: 1px;
`;

const PartialIcon = styled.svg`
  flex-shrink: 0;
  margin-top: 1px;
`;

function Mark({ mark }: { mark: CompareCell['mark'] }) {
  switch (mark) {
    case 'yes':
      return (
        <span style={{ marginTop: 1, display: 'inline-flex' }}>
          <CheckIcon />
        </span>
      );
    case 'no':
      return (
        <NoIcon width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="11" fill={colors.redBg} />
          <path d="M9 9l6 6M15 9l-6 6" stroke={colors.red} strokeWidth="2.2" strokeLinecap="round" />
        </NoIcon>
      );
    default:
      return (
        <PartialIcon width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="11" fill={colors.amberBg} />
          <path d="M8 12h8" stroke={colors.amber} strokeWidth="2.2" strokeLinecap="round" />
        </PartialIcon>
      );
  }
}

const FootNote = styled.p`
  margin: 26px auto 0;
  max-width: 640px;
  text-align: center;
  font-size: 14.5px;
  line-height: 1.6;
  color: ${colors.muted};
`;

const CtaRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 22px;
`;

export default function Compare() {
  return (
    <Section id="compare">
      <Container>
        <SectionHeading
          eyebrow="Why practices switch"
          title="Stop stitching your compliance record together"
          lede="The same checklist, year after year — kept in whatever was closest. Here is what that looks like when the evidence stops living in three places."
          center
        />

        <TableScroll tabIndex={0}>
          <Table>
            <caption>
              <SrOnly>How BrightGuard compares with spreadsheets and keeping compliance notes in your EHR</SrOnly>
            </caption>
            <thead>
              <tr>
                <th scope="col" style={{ padding: 0, width: 190 }}>
                  <SrOnly>What matters</SrOnly>
                </th>
                {COMPARE_COLUMNS.map((column) => (
                  <HeadCell key={column} featured={column === 'BrightGuard'}>
                    {column}
                  </HeadCell>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.label}>
                  <RowHeader scope="row">{row.label}</RowHeader>
                  {row.cells.map((cell, index) => (
                    <BodyCell key={COMPARE_COLUMNS[index]} featured={index === 2}>
                      <CellInner>
                        <Mark mark={cell.mark} />
                        <span>{cell.text}</span>
                      </CellInner>
                    </BodyCell>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </TableScroll>

        <FootNote>
          Every row above is a module you can switch on or off — the comparison ends where your state’s checklist
          begins.
        </FootNote>
        <CtaRow>
          <Button href="#demo" variant="primary">
            Book a demo
          </Button>
        </CtaRow>
      </Container>
    </Section>
  );
}
