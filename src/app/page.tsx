"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  MessageCircle, 
  Search, 
  Brain, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Star,
  ChevronDown,
  Bot,
  Sparkles,
  Zap,
  Lock,
  Users,
  Globe,
  Home,
  Car,
  Heart,
  Plane,
  Briefcase,
  GraduationCap
} from "lucide-react";

export default function LandingPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between h-full px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Pro Invest</h1>
              <p className="text-xs text-muted-foreground">Powered by AI</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm" className="hover:shadow-lg hover:scale-105 transition-all duration-300 bg-white/90 backdrop-blur-sm border-blue-200 hover:border-blue-300">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-blue-400/60 to-purple-400/50 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-purple-300/70 to-blue-300/60 rounded-full blur-2xl"></div>
          <div className="absolute bottom-40 left-1/4 w-48 h-48 bg-gradient-to-br from-blue-300/50 to-purple-500/40 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4 animate-pulse" />
            Powered by Advanced AI Technology
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Find the Perfect
            <span className="text-blue-600 block">Insurance — Instantly, with AI</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Our intelligent chatbot compares hundreds of health, auto, life, and travel insurance plans to find the one that fits your lifestyle and budget.
          </p>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Skip the research and forms — just chat with our AI, tell it your needs, and get personalized recommendations within seconds. No brokers. No confusion. Just clarity.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-12">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white h-14 px-10 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 group text-lg font-semibold">
                <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-14 px-10 hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white/90 backdrop-blur-sm text-lg font-semibold border-blue-200 hover:border-blue-300">
                <MessageCircle className="w-5 h-5 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Privacy First</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-gray-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose Our AI Insurance Assistant?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of insurance shopping with our intelligent AI-powered platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 border-0 shadow-sm bg-card hover:shadow-xl hover:scale-105 transition-all duration-500 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
                <Search className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Smart Comparison</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Compares plans from top insurers in real time, analyzing price, coverage, and claim benefits.
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-medium text-sm">
                <span>Real-time Analysis</span>
                <CheckCircle className="w-4 h-4" />
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-sm bg-card hover:shadow-xl hover:scale-105 transition-all duration-500 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:from-purple-100 group-hover:to-purple-200 transition-all duration-300">
                <Brain className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Personalized Recommendations</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Our AI understands your preferences and risk profile to suggest what fits you best.
              </p>
              <div className="flex items-center gap-2 text-purple-600 font-medium text-sm">
                <span>AI-Powered</span>
                <CheckCircle className="w-4 h-4" />
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-sm bg-card hover:shadow-xl hover:scale-105 transition-all duration-500 group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:from-green-100 group-hover:to-green-200 transition-all duration-300">
                <MessageCircle className="h-6 w-6 text-green-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Transparent Insights</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Explains why each plan is recommended — not just what to buy.
              </p>
              <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
                <span>Clear Explanations</span>
                <CheckCircle className="w-4 h-4" />
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-sm bg-card hover:shadow-xl hover:scale-105 transition-all duration-500 group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:from-orange-100 group-hover:to-orange-200 transition-all duration-300">
                <Lock className="h-6 w-6 text-orange-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Privacy First</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Your data is secure. We don't share personal details with third parties.
              </p>
              <div className="flex items-center gap-2 text-orange-600 font-medium text-sm">
                <span>Secure & Private</span>
                <CheckCircle className="w-4 h-4" />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started with insurance AI in four simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Start a Chat</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tell our AI what kind of insurance you're looking for.
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Search className="h-8 w-8 text-white" />
              </div>
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Get Tailored Options</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The chatbot scrapes the best plans from trusted providers.
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Compare & Decide</h3>
                <p className="text-muted-foreground leading-relaxed">
                  See transparent comparisons with pros and cons.
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Get Instant Quotes</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Receive links or quotes directly from verified insurers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Categories Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-r from-rose-50 via-white to-pink-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Explore Insurance Categories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find the perfect coverage for every aspect of your life
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Health Insurance", icon: Heart, desc: "Comprehensive health coverage for you and your family" },
              { name: "Auto Insurance", icon: Car, desc: "Vehicle protection plans for all types of cars" },
              { name: "Life Insurance", icon: Users, desc: "Family financial security and future planning" },
              { name: "Travel Insurance", icon: Plane, desc: "Travel safety coverage for domestic and international trips" },
              { name: "Home Insurance", icon: Home, desc: "Property protection for your most valuable asset" },
              { name: "Term & Personal Accident", icon: Shield, desc: "Personal accident and term life coverage" }
            ].map((category, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300 group cursor-pointer border-0 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300">
                    <category.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{category.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              More categories coming soon!
            </Badge>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What Our Users Say
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-muted-foreground font-medium">4.9/5 from 1,000+ users</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 shadow-sm border-0 bg-white/90 backdrop-blur-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  P
                </div>
                <div>
                  <div className="font-semibold text-foreground">Priya M.</div>
                  <div className="text-sm text-muted-foreground">Bangalore</div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                "Found my health insurance plan in 2 minutes! The chatbot explained the coverage better than any agent."
              </p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </Card>

            <Card className="p-8 shadow-sm border-0 bg-white/90 backdrop-blur-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div>
                  <div className="font-semibold text-foreground">Rohit S.</div>
                  <div className="text-sm text-muted-foreground">Delhi</div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                "I just typed 'best auto insurance under ₹10K' and got a perfect match instantly."
              </p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-tr from-violet-50 via-purple-50 to-fuchsia-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about our AI Insurance Assistant
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                question: "How does the chatbot find insurance plans?",
                answer: "It scrapes and analyzes plans from verified insurance providers and government-regulated portals using AI-based ranking."
              },
              {
                question: "Is this a brokerage or advisory platform?",
                answer: "No. We're a recommendation engine — we help you compare, but you buy directly from insurers."
              },
              {
                question: "Is my data safe?",
                answer: "Absolutely. We comply with all data protection standards and never share user data externally."
              },
              {
                question: "How accurate are the recommendations?",
                answer: "Our AI achieves 99%+ accuracy by analyzing real-time data from verified insurance providers and government databases."
              },
              {
                question: "Do I need to create an account?",
                answer: "No account required! You can start chatting with our AI immediately and get recommendations instantly."
              }
            ].map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-200">
                  <h3 className="font-semibold text-foreground pr-4">{faq.question}</h3>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-muted-foreground leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 mb-8">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="font-medium">Start Your Insurance Journey</span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
            Ready to Find Your Perfect Plan?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Chat with our AI and discover your best insurance options — personalized, transparent, and instant.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 h-14 px-10 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 group text-lg font-semibold">
                <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 bg-muted/20 border-t border-border/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold">Pro Invest</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Revolutionizing insurance shopping with AI-powered recommendations.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/insurance" className="hover:text-foreground transition-colors">AI Assistant</Link></li>
                <li><Link href="/insurance" className="hover:text-foreground transition-colors">Health Insurance</Link></li>
                <li><Link href="/insurance" className="hover:text-foreground transition-colors">Auto Insurance</Link></li>
                <li><Link href="/insurance" className="hover:text-foreground transition-colors">Life Insurance</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Use</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">FAQ</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Live Chat</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/20 pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 Pro Invest. All rights reserved. Powered by AI • Built with CopilotKit & LangGraph
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
