"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Check, ShoppingCart, Send } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Service categories
const categories = [
  { id: "all", name: "All Services" },
  { id: "branding", name: "Branding" },
  { id: "digital", name: "Digital Marketing" },
  { id: "documentation", name: "Documentation" },
  { id: "financial", name: "Financial" },
  { id: "hr", name: "HR & Recruitment" },
  { id: "legal", name: "Legal & Compliance" },
  { id: "packages", name: "Packages" },
]

// Services data
const services = [
  {
    id: 1,
    name: "Logo Design",
    description:
      "Professional logo design for your brand identity with unlimited revisions and multiple format delivery",
    price: 200,
    category: "branding",
    image: "/assets/services/logo-design.jpg",
    popular: true,
  },
  {
    id: 2,
    name: "Business Cards",
    description: "High-quality business cards with professional design (500 pieces) printed on premium cardstock",
    price: 50,
    category: "branding",
    image: "/assets/services/business-cards.jpg",
  },
  {
    id: 3,
    name: "Letterhead Design",
    description: "Professional letterhead design for official correspondence with your company branding",
    price: 80,
    category: "branding",
    image: "/assets/services/letterhead.jpg",
  },
  {
    id: 4,
    name: "Brochure Design",
    description: "Eye-catching marketing brochures to showcase your business",
    price: 150,
    category: "branding",
    image: "/assets/services/brochure.jpg",
  },
  {
    id: 5,
    name: "Website Development",
    description: "Professional business website with mobile optimization, SEO, and content management system",
    price: 800,
    category: "digital",
    image: "/assets/services/website.jpg",
    popular: true,
  },
  {
    id: 6,
    name: "Social Media Setup",
    description: "Facebook, Instagram, and LinkedIn business pages with content strategy and initial posts",
    price: 300,
    category: "digital",
    image: "/assets/services/social-media.jpg",
  },
  {
    id: 7,
    name: "Landing Page",
    description: "High-converting landing page designed to capture leads with compelling copy and call-to-actions",
    price: 400,
    category: "digital",
    image: "/assets/services/landing-page.jpg",
  },
  {
    id: 8,
    name: "Video Ads Creation",
    description: "Professional video advertisements for social media marketing with script writing and editing",
    price: 500,
    category: "digital",
    image: "/assets/services/video-ads.jpg",
  },
  {
    id: 9,
    name: "Business Plan Writing",
    description:
      "Comprehensive business plan for funding, strategy, and growth with financial projections and market analysis",
    price: 600,
    category: "documentation",
    image: "/assets/services/business-plan.jpg",
    popular: true,
  },
  {
    id: 10,
    name: "Proposal Writing",
    description:
      "Professional proposals for contracts, partnerships, and funding with persuasive content and formatting",
    price: 300,
    category: "documentation",
    image: "/assets/services/proposals.jpg",
  },
  {
    id: 11,
    name: "Policy Documentation",
    description: "HR policies, procedures, and employee handbooks tailored to your business needs and Ghana labor laws",
    price: 400,
    category: "documentation",
    image: "/assets/services/policies.jpg",
  },
  {
    id: 12,
    name: "Contract Templates",
    description:
      "Legal contract templates customized for your business needs including employment, service, and vendor contracts",
    price: 200,
    category: "documentation",
    image: "/assets/services/contracts.jpg",
  },
  {
    id: 13,
    name: "Bank Account Setup",
    description:
      "Complete assistance with business bank account opening process including document preparation and bank liaison",
    price: 150,
    category: "financial",
    image: "/assets/services/bank-account.jpg",
    popular: true,
  },
  {
    id: 14,
    name: "Tax Registration",
    description:
      "VAT and income tax registration with Ghana Revenue Authority including TIN application and compliance setup",
    price: 250,
    category: "financial",
    image: "/assets/services/tax-registration.jpg",
  },
  {
    id: 15,
    name: "Bookkeeping Setup",
    description: "Basic accounting system setup with training, chart of accounts, and monthly bookkeeping support",
    price: 400,
    category: "financial",
    image: "/assets/services/bookkeeping.jpg",
  },
  {
    id: 16,
    name: "Insurance Consultation",
    description:
      "Business insurance advice and policy setup assistance including liability, property, and professional indemnity",
    price: 100,
    category: "financial",
    image: "/assets/services/insurance.jpg",
  },
  {
    id: 17,
    name: "Job Posting",
    description:
      "Professional job advertisements on multiple platforms including job boards, social media, and recruitment sites",
    price: 100,
    category: "hr",
    image: "/assets/services/job-posting.jpg",
    popular: true,
  },
  {
    id: 18,
    name: "Candidate Screening",
    description:
      "Initial screening and shortlisting of qualified candidates including CV review, phone interviews, and reference checks",
    price: 200,
    category: "hr",
    image: "/assets/services/screening.jpg",
  },
  {
    id: 19,
    name: "HR Policy Development",
    description:
      "Complete HR policy framework tailored to your business including recruitment, performance management, and disciplinary procedures",
    price: 500,
    category: "hr",
    image: "/assets/services/hr-policies.jpg",
  },
  {
    id: 20,
    name: "Payroll Setup",
    description:
      "Payroll system implementation with training, tax calculations, and ongoing monthly payroll processing support",
    price: 300,
    category: "hr",
    image: "/assets/services/payroll.jpg",
  },
  {
    id: 21,
    name: "Legal Structure Advice",
    description:
      "Professional consultation on the best legal structure for your business including sole proprietorship vs company registration",
    price: 200,
    category: "legal",
    image: "/assets/services/legal-advice.jpg",
    popular: true,
  },
  {
    id: 22,
    name: "Compliance Audit",
    description:
      "Comprehensive review of your business compliance requirements including regulatory, tax, and industry-specific compliance",
    price: 400,
    category: "legal",
    image: "/assets/services/compliance-audit.jpg",
  },
  {
    id: 23,
    name: "Permit Applications",
    description:
      "Professional assistance with various business permit applications including environmental, health, and industry-specific permits",
    price: 300,
    category: "legal",
    image: "/assets/services/permits.jpg",
  },
  {
    id: 24,
    name: "Legal Document Review",
    description:
      "Professional review and advice on business legal documents including contracts, agreements, and compliance documents",
    price: 250,
    category: "legal",
    image: "/assets/services/document-review.jpg",
  },
  {
    id: 25,
    name: "Startup Essential Package",
    description: "Complete package for new businesses including registration, logo, business cards, and basic website",
    price: 1200,
    originalPrice: 1500,
    category: "packages",
    image: "/assets/packages/startup-essential.jpg",
    popular: true,
    items: [
      "Logo Design",
      "Business Cards (500 pcs)",
      "Letterhead Design",
      "Basic Website (5 pages)",
      "Social Media Setup",
      "Bank Account Assistance",
    ],
  },
  {
    id: 26,
    name: "Growth Package",
    description:
      "Comprehensive package for growing businesses including legal documents, financial setup, and marketing materials",
    price: 2000,
    originalPrice: 2500,
    category: "packages",
    image: "/assets/packages/growth-package.jpg",
    items: [
      "Everything in Startup Essential",
      "Comprehensive Business Plan",
      "Professional Video Advertisement",
      "HR Policy Development",
      "Tax Registration with GRA",
      "High-Converting Landing Page",
    ],
  },
  {
    id: 27,
    name: "Premium Business Package",
    description:
      "Premium package for established businesses including advanced website, legal consultation, and comprehensive branding",
    price: 3200,
    originalPrice: 4000,
    category: "packages",
    image: "/assets/packages/premium-business.jpg",
    items: [
      "Everything in Growth Package",
      "Advanced Website with E-commerce",
      "Complete Branding Suite",
      "Full Recruitment Services",
      "Legal Consultation & Compliance",
      "6 Months Ongoing Support",
    ],
  },
]

export default function ServicesMarketplace() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [cart, setCart] = useState<number[]>([])
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [currentService, setCurrentService] = useState<any>(null)
  const [customerName, setCustomerName] = useState("")
  const { toast } = useToast()

  const filteredServices =
    activeCategory === "all" ? services : services.filter((service) => service.category === activeCategory)

  const handleOrderService = (service: any) => {
    setCurrentService(service)
    setIsOrderDialogOpen(true)
  }

  const handleSendWhatsApp = () => {
    if (!customerName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to continue",
        variant: "destructive",
      })
      return
    }

    const isPackage = currentService.category === "packages"
    const priceInfo = isPackage
      ? `GHS ${currentService.price} (originally GHS ${currentService.originalPrice})`
      : `GHS ${currentService.price}`

    let message = `Hello! My name is ${customerName}. I am interested in your ${currentService.name} ${
      isPackage ? "package" : "service"
    } for ${priceInfo}.`

    if (isPackage && currentService.items) {
      message += "\n\nThis package includes:"
      currentService.items.forEach((item: string) => {
        message += `\n- ${item}`
      })
    }

    message += "\n\nCan you provide more details about this offering?"

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/233242799990?text=${encodedMessage}`

    // Add to cart
    if (!cart.includes(currentService.id)) {
      setCart([...cart, currentService.id])
    }

    // Show success toast
    toast({
      title: "Message prepared",
      description: "Opening WhatsApp to send your inquiry",
    })

    // Close dialog and open WhatsApp
    setIsOrderDialogOpen(false)
    window.open(whatsappUrl, "_blank")
  }

  const isInCart = (serviceId: number) => cart.includes(serviceId)

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Business Services Marketplace</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our range of professional services to help your business succeed. From branding to legal support,
            we've got you covered.
          </p>
        </div>

        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <div className="flex justify-center mb-8 overflow-x-auto pb-2">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="px-4 py-2">
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <Card key={service.id} className="overflow-hidden transition-all hover:shadow-lg">
                    <div className="relative h-48">
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt={service.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Fallback for missing images
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=200&width=300"
                          target.alt = "Image not available"
                        }}
                      />
                      {service.popular && <Badge className="absolute top-2 right-2 bg-blue-600">Popular</Badge>}
                    </div>
                    <CardHeader>
                      <CardTitle>{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        {service.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            GHS {service.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <p className="text-2xl font-bold text-blue-600">GHS {service.price.toLocaleString()}</p>
                      </div>

                      {service.items && (
                        <div className="mt-4">
                          <p className="font-medium mb-2">Includes:</p>
                          <ul className="space-y-1">
                            {service.items.map((item: string, index: number) => (
                              <li key={index} className="flex items-center text-sm">
                                <Check className="h-4 w-4 mr-2 text-green-500" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => handleOrderService(service)}
                        variant={isInCart(service.id) ? "outline" : "default"}
                      >
                        {isInCart(service.id) ? (
                          <span className="flex items-center">
                            <Check className="mr-2 h-4 w-4" /> Added to Cart
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <ShoppingCart className="mr-2 h-4 w-4" />{" "}
                            {service.category === "packages" ? "Order Package" : "Order Now"}
                          </span>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center gap-2 px-6 py-6">
              <ShoppingCart className="h-5 w-5" />
              <span className="font-bold">{cart.length}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Order Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order {currentService?.name}</DialogTitle>
            <DialogDescription>
              Complete this form to send your inquiry via WhatsApp to our customer service team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Your Name
              </Label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Service</Label>
              <div className="col-span-3 font-medium">{currentService?.name}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Price</Label>
              <div className="col-span-3 font-medium">
                {currentService?.originalPrice ? (
                  <span>
                    GHS {currentService?.price.toLocaleString()}{" "}
                    <span className="text-sm text-gray-500 line-through">
                      GHS {currentService?.originalPrice.toLocaleString()}
                    </span>
                  </span>
                ) : (
                  <span>GHS {currentService?.price.toLocaleString()}</span>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSendWhatsApp} className="bg-green-600 hover:bg-green-700">
              <Send className="mr-2 h-4 w-4" /> Send via WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
