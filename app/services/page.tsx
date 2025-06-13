import Header from "@/components/header"
import SuccessMessage from "@/components/success-message"
import ServicesMarketplace from "@/components/services-marketplace"
import WhatsAppChat from "@/components/whatsapp-chat"
import Footer from "@/components/footer"

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <SuccessMessage />
      <div id="services">
        <ServicesMarketplace />
      </div>
      <WhatsAppChat />
      <div id="contact"></div>
      <Footer />
    </main>
  )
}
