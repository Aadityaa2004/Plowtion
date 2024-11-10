"use client";

import "./globals.css"
import Navbar from "../app/components/Navbar"
import Footer from "../app/components/Footer"
import { SessionProvider } from "next-auth/react"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}
