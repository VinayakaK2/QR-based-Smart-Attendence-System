import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { TrustBar } from "@/components/landing/trust-bar"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Features } from "@/components/landing/features"
import { Roles } from "@/components/landing/roles"
import { Testimonials } from "@/components/landing/testimonials"
import { CTAFooter } from "@/components/landing/cta-footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <TrustBar />
      <HowItWorks />
      <Features />
      <Roles />
      <Testimonials />
      <CTAFooter />
    </main>
  )
}
