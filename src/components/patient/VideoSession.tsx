'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import DailyIframe from '@daily-co/daily-js';
import { api } from '@/utils/api';
import { motion } from 'framer-motion';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Users,
  Clock,
} from 'lucide-react';

interface VideoSessionProps {
  sessionId: string;
}

export function VideoSession({ sessionId }: VideoSessionProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLDivElement>(null);
  const [callObject, setCallObject] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const initVideo = async () => {
      try {
        // Démarrer la session vidéo via l'API
        const response = await api.post(`/sessions/${sessionId}/start-video`);
        const { videoRoomUrl } = response.data.data;

        // Créer l'iframe Daily.co
        const callFrame = DailyIframe.createFrame(videoRef.current, {
          iframeStyle: {
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '12px',
          },
          showLeaveButton: false,
          showFullscreenButton: true,
          showLocalVideo: true,
        });

        await callFrame.join({ url: videoRoomUrl });
        setCallObject(callFrame);
        setIsLoading(false);

        // Timer de la séance
        const timer = setInterval(() => {
          setSessionDuration((prev) => prev + 1);
        }, 1000);

        return () => {
          clearInterval(timer);
          callFrame.destroy();
        };
      } catch (error) {
        console.error('Error initializing video:', error);
        setIsLoading(false);
      }
    };

    initVideo();
  }, [sessionId]);

  const toggleMute = () => {
    if (callObject) {
      callObject.setLocalAudio(isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (callObject) {
      callObject.setLocalVideo(isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = async () => {
    if (callObject) {
      await callObject.leave();
      callObject.destroy();
    }
    router.push(`/patient/sessions/${sessionId}`);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-safran-500" />
          <span className="font-mono text-lg">{formatDuration(sessionDuration)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span className="text-sm">2 participants</span>
        </div>
        <button
          onClick={() => setShowChat(!showChat)}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
        >
          <MessageSquare className="h-5 w-5" />
        </button>
      </div>

      {/* Video Container */}
      <div className="flex-1 flex">
        <div className={`flex-1 relative ${showChat ? 'hidden lg:block lg:w-3/4' : 'w-full'}`}>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin h-12 w-12 border-t-4 border-safran-500 rounded-full mx-auto mb-4" />
                <p className="text-white">Connexion en cours...</p>
              </div>
            </div>
          ) : null}
          <div ref={videoRef} className="w-full h-full" />
        </div>

        {/* Chat sidebar */}
        {showChat && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 'auto' }}
            className="w-full lg:w-1/4 bg-gray-800 border-l border-gray-700"
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-white font-bold">Chat</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <p className="text-gray-400 text-sm text-center">
                  Le chat sera bientôt disponible
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 px-4 py-4 flex items-center justify-center gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleMute}
          className={`p-4 rounded-full transition-colors ${
            isMuted ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleVideo}
          className={`p-4 rounded-full transition-colors ${
            isVideoOff ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={endCall}
          className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          <PhoneOff className="h-6 w-6" />
        </motion.button>
      </div>
    </div>
  );
}
