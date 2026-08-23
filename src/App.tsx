import SiteShell from './app/Shell';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import Problem from './components/Problem';
import Features from './components/Features';
import AuditTrail from './components/AuditTrail';
import DataControl from './components/DataControl';
import HowItWorks from './components/HowItWorks';
import Digest from './components/Digest';
import Compare from './components/Compare';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import ChecklistCTA from './components/ChecklistCTA';
import DemoCTA from './components/DemoCTA';
import StickyCta from './components/StickyCta';

export default function App() {
  return (
    <SiteShell>
      <Hero />
      <TrustBar />
      <Problem />
      <Features />
      <AuditTrail />
      <DataControl />
      <HowItWorks />
      <Digest />
      <Compare />
      <Pricing />
      <FAQ />
      <ChecklistCTA />
      <DemoCTA />
      <StickyCta />
    </SiteShell>
  );
}
