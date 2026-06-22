import { CtaFooter } from '../components/sections/CtaFooter'
import { Features } from '../components/sections/Features'
import { Hero } from '../components/sections/Hero'
import { HowItWorks } from '../components/sections/HowItWorks'
import { ProofStrip } from '../components/sections/ProofStrip'
import { WhyZeroG } from '../components/sections/WhyZeroG'
import { Nav } from '../components/layout/Nav'

/**
 * Public landing page.
 */
export default function Landing() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Nav />
      <main id="main-content">
        <Hero />
        <ProofStrip />
        <HowItWorks />
        <Features />
        <WhyZeroG />
        <CtaFooter />
      </main>
    </>
  )
}
