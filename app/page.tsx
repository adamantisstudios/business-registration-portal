import Header from "@/components/header"
import HeroSlider from "@/components/hero-slider"
import RegistrationForm from "@/components/registration-form"
import WhatsAppChat from "@/components/whatsapp-chat"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <HeroSlider />
      <div className="container mx-auto px-4 py-12">
        <RegistrationForm />
      </div>
      <WhatsAppChat />
      <Footer />
    </main>
  )
}
