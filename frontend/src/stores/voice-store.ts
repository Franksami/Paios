import { create } from 'zustand'

interface VoiceState {
  isListening: boolean
  transcript: string
  interimTranscript: string
  recognition: any | null
  error: string | null
  
  // Actions
  startListening: () => void
  stopListening: () => void
  clearTranscript: () => void
  setError: (error: string | null) => void
}

export const useVoiceStore = create<VoiceState>((set, get) => ({
  isListening: false,
  transcript: '',
  interimTranscript: '',
  recognition: null,
  error: null,

  startListening: () => {
    const { recognition: existingRecognition } = get()
    
    if (existingRecognition) {
      existingRecognition.stop()
    }

    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      set({ error: 'Speech recognition is not supported in your browser' })
      return
    }

    const recognition = new SpeechRecognition()
    
    // Configure recognition
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 1

    // Set up event handlers
    recognition.onstart = () => {
      console.log('Voice recognition started')
      set({ isListening: true, error: null })
    }

    recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript) {
        set((state) => ({
          transcript: state.transcript + finalTranscript,
          interimTranscript: ''
        }))
      } else {
        set({ interimTranscript })
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Voice recognition error:', event.error)
      let errorMessage = 'Voice recognition error'
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.'
          break
        case 'audio-capture':
          errorMessage = 'No microphone found. Please check your device.'
          break
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow access and try again.'
          break
        case 'network':
          errorMessage = 'Network error. Please check your connection.'
          break
      }
      
      set({ error: errorMessage, isListening: false })
    }

    recognition.onend = () => {
      console.log('Voice recognition ended')
      set({ isListening: false })
    }

    // Start recognition
    try {
      recognition.start()
      set({ recognition })
    } catch (error) {
      console.error('Failed to start recognition:', error)
      set({ error: 'Failed to start voice recognition' })
    }
  },

  stopListening: () => {
    const { recognition } = get()
    
    if (recognition) {
      recognition.stop()
      set({ isListening: false })
    }
  },

  clearTranscript: () => {
    set({ transcript: '', interimTranscript: '' })
  },

  setError: (error: string | null) => {
    set({ error })
  },
}))