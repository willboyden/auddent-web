import { useEffect } from 'react';
import styled from '@emotion/styled';
import SiteShell from '../app/Shell';
import { CONTACT_EMAIL, PRODUCT_NAME } from '../data/content';

const Wrap = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 64px 24px 88px;
`;

const Title = styled.h1`
  font-size: clamp(28px, 4vw, 38px);
  line-height: 1.15;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.navy};
  margin: 0 0 14px;
`;

const Meta = styled.p`
  margin: 0 0 40px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate};
`;

const H2 = styled.h2`
  font-size: 24px;
  line-height: 1.25;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
  margin: 40px 0 12px;
`;

const P = styled.p`
  font-size: 16.5px;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 18px;
`;

const List = styled.ul`
  margin: 0 0 18px;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    font-size: 16.5px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text};
    padding-left: 22px;
    position: relative;
  }

  li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 9px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
  }
`;

const A = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 3px solid rgba(10, 99, 201, 0.45);
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const HomeLink = styled.a`
  display: inline-block;
  margin-top: 28px;
  font-size: 14.5px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 3px solid rgba(10, 99, 201, 0.45);
    outline-offset: 2px;
    border-radius: 6px;
  }
`;

export default function PrivacyPage() {
  useEffect(() => {
    document.title = `Privacy Policy | ${PRODUCT_NAME}`;
  }, []);

  return (
    <SiteShell>
      <Wrap>
        <Title>Privacy Policy</Title>
        <Meta>Last updated August 22, 2026</Meta>

        <P>
          This policy covers the {PRODUCT_NAME} marketing site — the pages you see before you sign up
          for anything. It is written the way we wish every vendor policy would be: short, plain, and
          about what actually happens.
        </P>

        <H2>What we collect</H2>
        <P>We collect information only if you give it to us through a form:</P>
        <List>
          <li>
            <strong>Demo request</strong> — your name, work email, practice name, number of offices,
            and any notes you choose to add.
          </li>
          <li>
            <strong>Inspection checklist</strong> — your name, work email, and your state.
          </li>
        </List>
        <P>
          This site does not ask for an account, and it sets no cookies of its own.
        </P>

        <H2>How we use it</H2>
        <P>
          A form submission goes to the {PRODUCT_NAME} team inbox so a person can reply. We use it
          only to respond to your request and follow up. We never sell or rent it, and we do not use
          it for third-party marketing.
        </P>

        <H2>What we do not collect</H2>
        <P>
          No patient data, ever. Nothing on this site connects to a practice’s compliance records.
          When you use the product itself, your practice data lives in your own self-hosted,
          single-file database with a tamper-evident audit log and full export on cancel — see the
          “Your data, your practice” section of this site for the details.
        </P>

        <H2>Analytics</H2>
        <P>
          We use Plausible to see which pages get read and how demos are requested. It is
          cookieless, keeps no persistent identifiers, and truncates IP addresses — it cannot tell
          who an individual visitor is.
        </P>

        <H2>Retention &amp; your choices</H2>
        <P>
          We keep a request only as long as it takes to follow up on it. To ask what we have on file
          for you, or to have it deleted, email{' '}
          <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A> — a person answers.
        </P>

        <H2>Contact</H2>
        <P>
          <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A>
        </P>

        <H2>Changes</H2>
        <P>If this policy changes, we will update this page and the date at the top.</P>

        <HomeLink href="/">← Back to the home page</HomeLink>
      </Wrap>
    </SiteShell>
  );
}
