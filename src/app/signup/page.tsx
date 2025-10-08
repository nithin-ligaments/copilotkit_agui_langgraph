"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Eye, EyeOff, AlertCircle, Chrome, Linkedin, Github, Mail, Sparkles, Users, TrendingUp, Award, CheckCircle, Rocket, Globe, Star } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const { signup, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    try {
      const success = await signup(formData.name, formData.email, formData.password)
      if (success) {
        toast.success("Welcome to Pro Invest! Your account has been created.")
        router.push("/insurance")
      } else {
        setError("Failed to create account. Please try again.")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Signup Background Pattern - Insurance/AI themed */}
      <div className="absolute inset-0">
        {/* Insurance/AI patterns */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-blue-400/60 to-purple-400/50 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-purple-300/70 to-blue-300/60 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 left-1/4 w-48 h-48 bg-gradient-to-br from-blue-300/50 to-purple-500/40 rounded-full blur-3xl"></div>
        
        {/* Insurance symbols */}
        <div className="absolute top-1/4 right-1/6 w-8 h-12 bg-blue-400/60 border border-blue-600/40 rounded-sm rotate-12 shadow-lg"></div>
        <div className="absolute bottom-1/3 left-1/6 w-10 h-6 bg-purple-400/70 border border-purple-600/50 rounded-full shadow-md"></div>
        
        {/* AI/Technology dots */}
        <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-blue-500/80 rounded-full shadow-lg animate-pulse"></div>
        <div className="absolute top-2/5 left-1/3 w-3 h-3 bg-purple-500/85 rounded-full shadow-md"></div>
        <div className="absolute top-1/2 left-2/5 w-5 h-5 bg-blue-500/75 rounded-full shadow-lg"></div>
        
        {/* Shield patterns for insurance */}
        <div className="absolute bottom-1/4 right-1/4 w-10 h-12 bg-blue-400/60 border border-blue-600/40" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}></div>
        <div className="absolute top-16 right-1/3 w-6 h-8 bg-purple-400/65 border border-purple-600/45" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}></div>
        
        {/* Connecting lines */}
        <div className="absolute top-1/4 left-1/3 w-24 h-1 bg-gradient-to-r from-transparent via-blue-500/60 to-transparent rotate-45 rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/5 w-20 h-1 bg-gradient-to-r from-transparent via-purple-500/65 to-transparent -rotate-12 rounded-full"></div>
      </div>

      <div className="flex min-h-screen relative z-10">
        {/* Left side - Benefits & Social Proof */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 xl:px-16">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Pro Invest</h2>
                <p className="text-sm text-gray-600">Powered by AI</p>
              </div>
            </div>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              Join 50,000+ Users Who've Found Their Perfect Insurance
            </h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Start your free account today and experience the future of insurance shopping with AI-powered recommendations.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Search className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Smart Comparison</p>
                  <p className="text-sm text-gray-600">Compares plans from top insurers in real time</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Personalized Recommendations</p>
                  <p className="text-sm text-gray-600">AI understands your preferences and risk profile</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Transparent Insights</p>
                  <p className="text-sm text-gray-600">Explains why each plan is recommended</p>
                </div>
              </div>
            </div>
            
            {/* Success metrics */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/50 text-center">
                <div className="text-2xl font-bold text-blue-600">10x</div>
                <div className="text-xs text-gray-600">Faster Search</div>
              </div>
              <div className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/50 text-center">
                <div className="text-2xl font-bold text-purple-600">99%</div>
                <div className="text-xs text-gray-600">Accuracy Rate</div>
              </div>
            </div>
            
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Featured in TechCrunch</span>
              </div>
              <p className="text-sm text-gray-600 italic">
                "Pro Invest is revolutionizing how people find insurance with its cutting-edge AI capabilities."
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Signup Form */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-3 rounded-xl shadow-lg">
              <Shield className="h-7 w-7" />
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-balance tracking-tight">Join Pro Invest</h1>
          <p className="text-muted-foreground mt-3 leading-relaxed">Create your AI insurance platform account</p>
        </div>

        <Card className="border-0 shadow-sm bg-card">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-xl text-center font-semibold tracking-tight">Create Account</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg mb-4">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            {/* Social Signup Buttons */}
            <div className="space-y-3 mb-6">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-11 border-border/50 hover:bg-gray-50 transition-colors"
                onClick={() => toast.info("Google signup coming soon!")}
              >
                <Chrome className="h-4 w-4 mr-2" />
                Continue with Google
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-11 border-border/50 hover:bg-blue-50 transition-colors"
                  onClick={() => toast.info("LinkedIn signup coming soon!")}
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-11 border-border/50 hover:bg-gray-50 transition-colors"
                  onClick={() => toast.info("GitHub signup coming soon!")}
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or create account with email</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="h-11 border-border/50 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-11 border-border/50 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password (min 6 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-11 pr-10 border-border/50 focus:border-teal-500 focus:ring-teal-500/20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="h-11 pr-10 border-border/50 focus:border-teal-500 focus:ring-teal-500/20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground leading-relaxed">
                By creating an account, you agree to our{" "}
                <Link href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Privacy Policy
                </Link>
                .
              </div>
              
              <Button type="submit" className="w-full h-11 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-sm" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login" className="text-foreground hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
