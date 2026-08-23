import { useState } from 'react';
import styled from '@emotion/styled';
import { NAV_LINKS, PAGE_LINKS, PRODUCT_NAME } from '../data/content';
import { trackEvent } from '../lib/analytics';
import { Button, Container } from './ui';

const HeaderBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  height: 64px;
`;

const Brand = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 19px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.navy};
  text-decoration: none;
  letter-spacing: -0.01em;

  &:focus-visible {
    outline: 3px solid rgba(10, 99, 201, 0.45);
    outline-offset: 2px;
    border-radius: 6px;
  }
`;

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const NavList = styled.ul`
  display: flex;
  align-items: center;
  gap: 2px;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavA = styled.a`
  display: inline-block;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14.5px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.navy};
    background: ${({ theme }) => theme.colors.sky};
  }

  &:focus-visible {
    outline: 3px solid rgba(10, 99, 201, 0.45);
    outline-offset: 2px;
  }
`;

const CtaSlot = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: inline-flex;
  }
`;

const MenuButton = styled.button`
  display: none;
  margin-left: auto;
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 9px 11px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.navy};

  &:focus-visible {
    outline: 3px solid rgba(10, 99, 201, 0.45);
    outline-offset: 2px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: inline-flex;
    flex-direction: column;
    gap: 4px;
    justify-content: center;
  }
`;

const MenuLine = styled.span`
  width: 18px;
  height: 2px;
  background: currentColor;
  border-radius: 2px;
`;

const MobilePanel = styled.nav<{ open: boolean }>`
  display: ${({ open }) => (open ? 'block' : 'none')};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 12px 24px 20px;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  a {
    display: block;
    padding: 12px 10px;
    border-radius: 8px;
    font-size: 15.5px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.navy};
    text-decoration: none;

    &:hover {
      background: ${({ theme }) => theme.colors.sky};
    }
  }
`;

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 2 28 7v9c0 7.2-5.1 12.7-12 14.4C9.1 28.7 4 23.2 4 16V7l12-5z" fill="#0a63c9" />
      <path d="M16 5.4 25 9v7.4c0 5.6-3.7 9.9-9 11.3-5.3-1.4-9-5.7-9-11.3V9l9-3.6z" fill="#0e77e0" />
      <path
        d="M10.8 16.4l3.4 3.4 7-7"
        stroke="#fff"
        strokeWidth="2.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <HeaderBar id="top">
      <Container>
        <Inner>
          <Brand href="/#top">
            <LogoMark />
            {PRODUCT_NAME}
          </Brand>
          <DesktopNav aria-label="Main">
            <NavList>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <NavA href={link.href}>{link.label}</NavA>
                </li>
              ))}
              {PAGE_LINKS.map((link) => (
                <li key={link.href}>
                  <NavA href={link.href}>{link.label}</NavA>
                </li>
              ))}
            </NavList>
          </DesktopNav>
          <CtaSlot>
            <Button href="/#demo" onClick={() => trackEvent('cta_click', { source: 'header' })}>
              Book a demo
            </Button>
          </CtaSlot>
          <MenuButton
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <MenuLine aria-hidden="true" />
            <MenuLine aria-hidden="true" />
            <MenuLine aria-hidden="true" />
          </MenuButton>
        </Inner>
      </Container>
      <MobilePanel id="mobile-nav" aria-label="Mobile" open={open}>
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={close}>
                {link.label}
              </a>
            </li>
          ))}
          {PAGE_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={close}>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/#demo"
              onClick={() => {
                close();
                trackEvent('cta_click', { source: 'mobile_menu' });
              }}
            >
              Book a demo
            </a>
          </li>
        </ul>
      </MobilePanel>
    </HeaderBar>
  );
}
