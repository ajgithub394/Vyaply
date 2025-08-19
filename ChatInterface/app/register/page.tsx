"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, MessageCircle, Moon, Sun, ArrowLeft, ArrowRight, Check } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import Link from "next/link"

const CURRENCIES = [
  { code: "USD", name: "USD" },
  { code: "EUR", name: "EUR" },
  { code: "GBP", name: "GBP" },
  { code: "JPY", name: "JPY" },
  { code: "AUD", name: "AUD" },
  { code: "INR", name: "INR" },
]

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
  "Australia",
  "India"
]

export default function RegisterPage() {
  const [mounted, setMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const [companyData, setCompanyData] = useState({
    companyName: "",
    abbreviation: "",
    currency: "",
    country: "",
  })

  const [representativeData, setRepresentativeData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!companyData.companyName) newErrors.companyName = "Company name is required"
    if (!companyData.abbreviation) newErrors.abbreviation = "Abbreviation is required"
    if (!companyData.currency) newErrors.currency = "Currency is required"
    if (!companyData.country) newErrors.country = "Country is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (!representativeData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(representativeData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!representativeData.firstName) newErrors.firstName = "First name is required"
    if (!representativeData.lastName) newErrors.lastName = "Last name is required"

    if (!representativeData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!/^\+?[\d\s-()]+$/.test(representativeData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number"
    }

    if (!representativeData.password) {
      newErrors.password = "Password is required"
    } else if (representativeData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!representativeData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (representativeData.password !== representativeData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep2()) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Registration data:", { ...companyData, ...representativeData })
      setIsLoading(false)
      // Redirect to login or chat app would happen here
    }, 2000)
  }

  const handleCompanyInputChange = (field: string, value: string) => {
    setCompanyData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleRepresentativeInputChange = (field: string, value: string) => {
    setRepresentativeData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header with theme toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">ChatApp</h1>
              <p className="text-sm text-muted-foreground">Business Communication</p>
            </div>
          </div>
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground hover:text-foreground"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {currentStep > 1 ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <span className="ml-2 text-sm text-foreground">Company</span>
          </div>
          <div className={`w-8 h-0.5 ${currentStep >= 2 ? "bg-primary" : "bg-border"}`} />
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
            <span className="ml-2 text-sm text-foreground">Representative</span>
          </div>
        </div>

        {/* Registration Card */}
        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-semibold text-foreground">
              {currentStep === 1 ? "Company Details" : "Representative Details"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {currentStep === 1 ? "Tell us about your company" : "Create your account details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 1 ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleNext()
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm font-medium text-foreground">
                    Company Name
                  </Label>
                  <Input
                    id="companyName"
                    placeholder="Enter company name"
                    value={companyData.companyName}
                    onChange={(e) => handleCompanyInputChange("companyName", e.target.value)}
                    className={`bg-input border-border focus:ring-ring ${
                      errors.companyName ? "border-destructive focus:ring-destructive" : ""
                    }`}
                  />
                  {errors.companyName && <p className="text-sm text-destructive">{errors.companyName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="abbreviation" className="text-sm font-medium text-foreground">
                    Abbreviation
                  </Label>
                  <Input
                    id="abbreviation"
                    placeholder="e.g., ACME"
                    value={companyData.abbreviation}
                    onChange={(e) => handleCompanyInputChange("abbreviation", e.target.value)}
                    className={`bg-input border-border focus:ring-ring ${
                      errors.abbreviation ? "border-destructive focus:ring-destructive" : ""
                    }`}
                  />
                  {errors.abbreviation && <p className="text-sm text-destructive">{errors.abbreviation}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-sm font-medium text-foreground">
                    Currency
                  </Label>
                  <Select
                    value={companyData.currency}
                    onValueChange={(value) => handleCompanyInputChange("currency", value)}
                  >
                    <SelectTrigger
                      className={`bg-input border-border focus:ring-ring ${
                        errors.currency ? "border-destructive focus:ring-destructive" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.currency && <p className="text-sm text-destructive">{errors.currency}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium text-foreground">
                    Country
                  </Label>
                  <Select
                    value={companyData.country}
                    onValueChange={(value) => handleCompanyInputChange("country", value)}
                  >
                    <SelectTrigger
                      className={`bg-input border-border focus:ring-ring ${
                        errors.country ? "border-destructive focus:ring-destructive" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Next Step <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={representativeData.firstName}
                      onChange={(e) => handleRepresentativeInputChange("firstName", e.target.value)}
                      className={`bg-input border-border focus:ring-ring ${
                        errors.firstName ? "border-destructive focus:ring-destructive" : ""
                      }`}
                    />
                    {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={representativeData.lastName}
                      onChange={(e) => handleRepresentativeInputChange("lastName", e.target.value)}
                      className={`bg-input border-border focus:ring-ring ${
                        errors.lastName ? "border-destructive focus:ring-destructive" : ""
                      }`}
                    />
                    {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@company.com"
                    value={representativeData.email}
                    onChange={(e) => handleRepresentativeInputChange("email", e.target.value)}
                    className={`bg-input border-border focus:ring-ring ${
                      errors.email ? "border-destructive focus:ring-destructive" : ""
                    }`}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium text-foreground">
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={representativeData.phoneNumber}
                    onChange={(e) => handleRepresentativeInputChange("phoneNumber", e.target.value)}
                    className={`bg-input border-border focus:ring-ring ${
                      errors.phoneNumber ? "border-destructive focus:ring-destructive" : ""
                    }`}
                  />
                  {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={representativeData.password}
                      onChange={(e) => handleRepresentativeInputChange("password", e.target.value)}
                      className={`bg-input border-border focus:ring-ring pr-10 ${
                        errors.password ? "border-destructive focus:ring-destructive" : ""
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={representativeData.confirmPassword}
                      onChange={(e) => handleRepresentativeInputChange("confirmPassword", e.target.value)}
                      className={`bg-input border-border focus:ring-ring pr-10 ${
                        errors.confirmPassword ? "border-destructive focus:ring-destructive" : ""
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 border-border text-foreground hover:bg-accent bg-transparent"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trust elements */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">Secure business communication platform</p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
