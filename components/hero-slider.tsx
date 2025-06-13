const HeroSlider = () => {
  return (
    <div className="relative w-full h-64 md:h-96 lg:h-[600px] overflow-hidden">
      {/* Slider Container */}
      <div className="flex transition-transform duration-500 ease-in-out">
        {/* Slide 1 */}
        <div className="min-w-full h-full flex items-center justify-center relative">
          <img src="/placeholder.png" alt="Business Permit" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 text-white text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-2">Streamline Your Business Permits</h2>
            <p className="text-sm md:text-lg">Get your business permits quickly and easily.</p>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="min-w-full h-full flex items-center justify-center relative">
          <img src="/placeholder.png" alt="Tax Compliance" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 text-white text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-2">Ensure Tax Compliance</h2>
            <p className="text-sm md:text-lg">Stay compliant with all tax regulations.</p>
          </div>
        </div>

        {/* Slide 3 */}
        <div className="min-w-full h-full flex items-center justify-center relative">
          <img
            src="/placeholder.png"
            alt="Financial Planning"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 text-white text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-2">Plan Your Finances Wisely</h2>
            <p className="text-sm md:text-lg">Get expert advice on financial planning.</p>
          </div>
        </div>
      </div>

      {/* Navigation Dots (Optional) */}
      {/* <div className="absolute bottom-4 left-0 w-full flex justify-center">
        <button className="w-3 h-3 rounded-full bg-gray-400 mx-1"></button>
        <button className="w-3 h-3 rounded-full bg-gray-400 mx-1"></button>
        <button className="w-3 h-3 rounded-full bg-gray-400 mx-1"></button>
      </div> */}
    </div>
  )
}

export default HeroSlider
