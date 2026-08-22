import styled from '@emotion/styled';
import { TRUST_ITEMS } from '../data/content';
import { colors } from '../theme';
import { Container } from './ui';

const Wrap = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: #ffffff;
  padding: 22px 0;
`;

const Label = styled.div`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 12px;
  text-align: center;
`;

const Row = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 14px;
`;

const Item = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.navy};
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill}px;
  padding: 8px 16px;
`;

const Dot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${colors.green};
  display: inline-block;
`;

export default function TrustBar() {
  return (
    <Wrap>
      <Container>
        <Label>Covers the rules your state actually checks</Label>
        <Row>
          {TRUST_ITEMS.map((item) => (
            <Item key={item}>
              <Dot />
              {item}
            </Item>
          ))}
        </Row>
      </Container>
    </Wrap>
  );
}
