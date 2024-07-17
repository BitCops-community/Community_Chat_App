"use client";
import { useState, useEffect } from "react";

const useAudioControl = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [gainNode, setGainNode] = useState<GainNode | null>(null);

  useEffect(() => {
    const context = new AudioContext();
    const gain = context.createGain();
    gain.connect(context.destination);
    setAudioContext(context);
    setGainNode(gain);

    return () => {
      context.close();
    };
  }, []);

  const mute = () => {
    if (gainNode) {
      gainNode.gain.setValueAtTime(0, audioContext!.currentTime);
    }
  };

  const unmute = () => {
    if (gainNode) {
      gainNode.gain.setValueAtTime(1, audioContext!.currentTime);
    }
  };

  return { mute, unmute };
};

export default useAudioControl;
