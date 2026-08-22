import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Button, Container } from './ui';

const THRESHOLD = 720;

const Bar = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  background: rgba(11, 37, 69, 0.97);
  color: #ffffff;
  box-shadow: 0 -4px 20px rgba(11, 37, 69, 0.25);
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 12px;
  padding-bottom: 14px;
`;

const Text = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #dbe7f5;

  @media (max-width: 720px) {
    font-size: 14px;
  }
`;

export default function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <Bar role="region" aria-label="Quick demo booking">
      <Container>
        <Row>
          <Text>Ready to see how it works on your state’s rules?</Text>
          <Button href="#demo" variant="light">
            Book a 30-minute demo
          </Button>
        </Row>
      </Container>
    </Bar>
  );
}
