"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Play,
  Square,
  Download,
  Volume2,
  AlertCircle,
  Info,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm border-border/50"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

interface Voice {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
}

export default function TextToSpeechApp() {
  const [text, setText] = useState(
    "Welcome to the Text-to-Speech application! Type your message here and click play to hear it spoken aloud."
  );
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string>("");

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load available voices
  const loadVoices = useCallback(() => {
    const availableVoices = speechSynthesis.getVoices();
    const voiceList: Voice[] = availableVoices.map((voice) => ({
      voice,
      name: voice.name,
      lang: voice.lang,
    }));
    setVoices(voiceList);

    if (!selectedVoice && voiceList.length > 0) {
      setSelectedVoice(voiceList[0].voice.name);
    }
  }, [selectedVoice]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setIsSupported(false);
      return;
    }

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      speechSynthesis.cancel();
    };
  }, [loadVoices]);

  const getSelectedVoice = useCallback(() => {
    return voices.find((v) => v.voice.name === selectedVoice)?.voice || null;
  }, [voices, selectedVoice]);

  const createUtterance = useCallback(
    (speechText: string) => {
      const utterance = new SpeechSynthesisUtterance(speechText);
      const voice = getSelectedVoice();

      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = Math.max(0.1, Math.min(3, rate));
      utterance.pitch = Math.max(0, Math.min(2, pitch));
      utterance.volume = Math.max(0, Math.min(1, volume));

      return utterance;
    },
    [getSelectedVoice, rate, pitch, volume]
  );

  const resetState = () => {
    setIsPlaying(false);
    setError("");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const speak = useCallback(() => {
    if (!text.trim()) return;

    setError("");

    if (!speechSynthesis) {
      setError("Speech synthesis not available");
      return;
    }

    speechSynthesis.cancel();
    resetState();

    setTimeout(() => {
      try {
        const utterance = createUtterance(text);

        utterance.onstart = () => {
          setIsPlaying(true);
          setError("");
        };

        utterance.onend = () => {
          resetState();
        };

        utterance.onerror = (event) => {
          if (event.error !== "interrupted" && event.error !== "canceled") {
            console.error("Speech synthesis error:", event.error);
            switch (event.error) {
              case "audio-busy":
                setError("Audio system is busy. Please wait and try again.");
                break;
              case "not-allowed":
                setError(
                  "Speech synthesis not allowed. Check browser permissions."
                );
                break;
              case "network":
                setError("Network error occurred during speech synthesis.");
                break;
              default:
                setError(`Speech error: ${event.error}`);
            }
          }
          resetState();
        };

        utteranceRef.current = utterance;
        speechSynthesis.speak(utterance);
      } catch (err) {
        console.error("Error starting speech:", err);
        setError("Failed to start speech synthesis.");
        resetState();
      }
    }, 100);
  }, [text, createUtterance]);

  const stop = useCallback(() => {
    try {
      speechSynthesis.cancel();
    } catch (err) {
      console.error("Error stopping speech:", err);
      resetState();
    }
  }, []);

  const downloadTextAsFile = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "speech-text.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const testVoiceSettings = useCallback(() => {
    if (!selectedVoice) return;

    const testUtterance = createUtterance("Testing voice settings");
    speechSynthesis.cancel();

    setTimeout(() => {
      testUtterance.onend = resetState;
      testUtterance.onerror = (event) => {
        if (event.error !== "interrupted" && event.error !== "canceled") {
          setError(`Test failed: ${event.error}`);
        }
        resetState();
      };
      speechSynthesis.speak(testUtterance);
    }, 100);
  }, [selectedVoice, createUtterance]);

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
        <div className="max-w-4xl mx-auto pt-20">
          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-800 dark:text-red-300">
              Your browser doesn't support the Web Speech API. Please try using
              a modern browser like Chrome, Firefox, or Safari.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
      <ThemeToggle />
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Text-to-Speech App
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Convert your text to speech using the Web Speech API
          </p>
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-800 dark:text-red-300">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Text Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="text-input">
                  Enter text to convert to speech:
                </Label>
                <Textarea
                  id="text-input"
                  placeholder="Type your message here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px] mt-2"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={speak}
                  disabled={!text.trim() || isPlaying}
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Play
                </Button>

                <Button
                  onClick={stop}
                  disabled={!isPlaying}
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Square className="h-4 w-4" />
                  Stop
                </Button>

                <Button
                  onClick={downloadTextAsFile}
                  disabled={!text.trim()}
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Download className="h-4 w-4" />
                  Download Text
                </Button>
              </div>

              {isPlaying && (
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  🔊 Speaking...
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Speech Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="voice-select">Voice:</Label>
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem
                        key={voice.voice.name}
                        value={voice.voice.name}
                      >
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Button
                  onClick={testVoiceSettings}
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  disabled={!selectedVoice}
                >
                  Test Voice Settings
                </Button>
              </div>

              <div>
                <Label htmlFor="rate-slider">
                  Speech Rate: {rate.toFixed(1)}x
                </Label>
                <Slider
                  id="rate-slider"
                  min={0.1}
                  max={3}
                  step={0.1}
                  value={[rate]}
                  onValueChange={(value) => setRate(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Slow</span>
                  <span>Normal</span>
                  <span>Fast</span>
                </div>
              </div>

              <div>
                <Label htmlFor="pitch-slider">Pitch: {pitch.toFixed(1)}</Label>
                <Slider
                  id="pitch-slider"
                  min={0}
                  max={2}
                  step={0.1}
                  value={[pitch]}
                  onValueChange={(value) => setPitch(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low</span>
                  <span>Normal</span>
                  <span>High</span>
                </div>
              </div>

              <div>
                <Label htmlFor="volume-slider">
                  Volume: {Math.round(volume * 100)}%
                </Label>
                <Slider
                  id="volume-slider"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Quiet</span>
                  <span>Normal</span>
                  <span>Loud</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3 text-center">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  🔊 Real-time Speech
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Converts text to speech using your browser's built-in
                  capabilities
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  🎚️ Customizable
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Adjust voice, rate, pitch, and volume to your preference
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  🛑 Simple Controls
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Easy play and stop controls for reliable speech synthesis
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-300">
            <strong>Note:</strong> Due to browser security limitations, direct
            audio recording of speech synthesis is not supported. You can use
            your system's audio recording software to capture the speech output
            if needed.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
