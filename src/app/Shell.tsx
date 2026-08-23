import { useEffect } from 'react';
import { Global } from '@emotion/react';
import styled from '@emotion/styled';
import type { ReactNode } from 'react';
import { colors } from '../theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SkipLink = styled.a`
  position: absolute;
  top: -48px;
  left: 16px;
  z-index: 100;
  background: ${colors.navy};
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 8px;
  text-decoration: none;
  transition: top 0.15s ease;

  &:focus {
    top: 12px;
  }
`;

export const globalStyles = `
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: ${colors.bg};
    color: ${colors.text};
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  img, svg {
    max-width: 100%;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    * {
      transition: none !important;
      animation: none !important;
    }
  }
`;

export default function SiteShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      document.getElementById(id)?.scrollIntoView();
    };
    // Cross-page nav (e.g. /resources -> /#pricing): the target only exists
    // after this render, so the browser's native fragment scroll — which
    // fires at load — has nothing to scroll to. Scroll once after mount,
    // and again on any in-page hash change.
    if (window.location.hash) requestAnimationFrame(scrollToHash);
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  return (
    <>
      <Global styles={globalStyles} />
      <SkipLink href="#main">Skip to content</SkipLink>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
