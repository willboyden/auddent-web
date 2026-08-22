import styled from '@emotion/styled';
import { NAV_LINKS, PRODUCT_NAME, PRODUCT_TAGLINE } from '../data/content';
import { Container } from './ui';

const Wrap = styled.footer`
  background: #081a33;
  color: #b9cbe0;
  padding: 48px 0 32px;
`;

const Top = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) repeat(2, minmax(0, 1fr));
  gap: 40px;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(185, 203, 224, 0.18);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
`;

const BrandName = styled.p`
  margin: 0 0 10px;
  font-size: 17px;
  font-weight: 800;
  color: #ffffff;
`;

const BrandLede = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  max-width: 340px;
`;

const ColTitle = styled.h4`
  margin: 0 0 14px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #7fb1e8;
`;

const LinkList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LinkA = styled.a`
  font-size: 14px;
  color: #dbe7f5;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 3px solid rgba(127, 177, 232, 0.5);
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 24px;
  font-size: 13px;
`;

const Legal = styled.p`
  margin: 0;
  font-size: 12.5px;
  color: #8fa3ba;
  max-width: 720px;
  margin-top: 14px;
  line-height: 1.6;
`;

export default function Footer() {
  return (
    <Wrap>
      <Container>
        <Top>
          <div>
            <BrandName>{PRODUCT_NAME}</BrandName>
            <BrandLede>{PRODUCT_TAGLINE}. Built by people who have sat on the other side of the auditor’s clipboard.</BrandLede>
          </div>
          <nav aria-label="Footer">
            <ColTitle>Product</ColTitle>
            <LinkList>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <LinkA href={link.href}>{link.label}</LinkA>
                </li>
              ))}
            </LinkList>
          </nav>
          <div>
            <ColTitle>Get started</ColTitle>
            <LinkList>
              <li>
                <LinkA href="#demo">Book a demo</LinkA>
              </li>
              <li>
                <LinkA href="#pricing">See pricing</LinkA>
              </li>
              <li>
                <LinkA href="mailto:hello@brightguard.example">hello@brightguard.example</LinkA>
              </li>
            </LinkList>
          </div>
        </Top>
        <Bottom>
          <span>© 2026 {PRODUCT_NAME} Compliance. All rights reserved.</span>
          <span>Part of the Dental Compliance SaaS family</span>
        </Bottom>
        <Legal>
          Regulatory requirements vary by state and change over time. BrightGuard organizes and evidences your
          compliance work; it does not provide legal advice. Confirm your specific obligations with your compliance
          counsel or your state’s board of dentistry.
        </Legal>
      </Container>
    </Wrap>
  );
}
