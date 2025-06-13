const ServicesMarketplace = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Services Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Service Card 1 */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <img src="/placeholder.png" alt="Business Cards" className="w-full h-48 object-cover mb-2 rounded-md" />
          <h2 className="text-lg font-semibold mb-1">Business Card Design</h2>
          <p className="text-gray-600">Get professionally designed business cards to make a lasting impression.</p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
            Learn More
          </button>
        </div>

        {/* Service Card 2 */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <img src="/placeholder.png" alt="Logo Design" className="w-full h-48 object-cover mb-2 rounded-md" />
          <h2 className="text-lg font-semibold mb-1">Logo Design</h2>
          <p className="text-gray-600">Create a unique and memorable logo for your brand.</p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
            Learn More
          </button>
        </div>

        {/* Service Card 3 */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <img src="/placeholder.png" alt="Website Development" className="w-full h-48 object-cover mb-2 rounded-md" />
          <h2 className="text-lg font-semibold mb-1">Website Development</h2>
          <p className="text-gray-600">Build a professional and responsive website for your business.</p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
            Learn More
          </button>
        </div>

        {/* Service Card 4 */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <img
            src="/placeholder.png"
            alt="Social Media Marketing"
            className="w-full h-48 object-cover mb-2 rounded-md"
          />
          <h2 className="text-lg font-semibold mb-1">Social Media Marketing</h2>
          <p className="text-gray-600">Boost your online presence with effective social media strategies.</p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
            Learn More
          </button>
        </div>

        {/* Service Card 5 */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <img src="/placeholder.png" alt="SEO Optimization" className="w-full h-48 object-cover mb-2 rounded-md" />
          <h2 className="text-lg font-semibold mb-1">SEO Optimization</h2>
          <p className="text-gray-600">Improve your website's ranking on search engines.</p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
            Learn More
          </button>
        </div>

        {/* Service Card 6 */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <img src="/placeholder.png" alt="Content Writing" className="w-full h-48 object-cover mb-2 rounded-md" />
          <h2 className="text-lg font-semibold mb-1">Content Writing</h2>
          <p className="text-gray-600">Engage your audience with high-quality and compelling content.</p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServicesMarketplace
