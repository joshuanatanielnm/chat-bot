import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col overflow-y-auto">
      <header className="py-6 px-4 sm:px-6 lg:px-8 shadow-md bg-slate-900/50 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Cognitica AI
          </h1>
          <nav className="space-x-8">
            <Link
              href="#products"
              className="hover:text-purple-300 transition-colors"
            >
              Products
            </Link>
            <Link
              href="#contact"
              className="hover:text-purple-300 transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Building the Future with{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Intelligent Solutions
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Welcome to the showcase of Cognitica AI&apos;s cutting-edge
            products. Explore innovations designed to revolutionize your
            workflow and unlock new possibilities.
          </p>
          <div>
            <Link
              href="#products"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 text-lg"
            >
              Explore Our Products
            </Link>
          </div>
        </section>

        {/* Products Section Placeholder */}
        <section id="products" className="py-16 sm:py-20 bg-slate-800/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl sm:text-4xl font-bold text-center mb-12 tracking-tight">
              Our AI-Powered Products
            </h3>
            <div className="mx-auto justify-around items-center flex flex-row flex-wrap gap-4">
              {/* Product Card 1 (Placeholder) */}
              <div className="bg-slate-700/50 p-6 rounded-xl shadow-xl hover:shadow-purple-500/30 transition-shadow duration-300 max-w-xl mx-auto">
                <Image
                  src="/products/chatbot.png"
                  alt="AI Product One"
                  width={1000}
                  height={1000}
                  className="rounded-lg max-h-72 overflow-hidden"
                />
                <h4 className="text-xl font-semibold mb-2 mt-6">Chatbot</h4>
                <p className="text-slate-300 text-sm mb-4">
                  Our chatbot is a powerful tool that can help you answer
                  questions and help you with your business.
                </p>
                <Link
                  href="/chatbot"
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Learn More &rarr;
                </Link>
              </div>
              {/* Product Card 2 (Placeholder) */}
              <div className="bg-slate-700/50 p-6 rounded-xl shadow-xl hover:shadow-purple-500/30 transition-shadow duration-300 max-w-xl mx-auto">
                <Image
                  src="/products/agent.png"
                  alt="Agent preview"
                  width={1000}
                  height={1000}
                  className="rounded-lg max-h-72 overflow-hidden"
                />
                <h4 className="text-xl font-semibold mb-2 mt-6">Agent</h4>
                <p className="text-slate-300 text-sm mb-4">
                  Our agent is a powerful tool that can help you answer
                  questions and help you with your business.
                </p>
                <Link
                  href="/agent"
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Learn More &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-16 sm:py-20 bg-slate-800/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight">
              Get in Touch
            </h3>
            <p className="text-lg text-slate-300 max-w-xl mx-auto mb-8">
              Have questions or want to learn more about how Cognitica AI can
              help your business? Reach out to us!
            </p>
            <a
              href="mailto:joshuanmanuputty@gmail.com"
              className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 text-lg"
            >
              Contact Us
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-slate-900 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} Cognitica AI. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs mt-1">
            Innovating the Future, One Algorithm at a Time.
          </p>
        </div>
      </footer>
    </div>
  );
}
