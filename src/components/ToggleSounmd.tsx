"use client"
import React, { useEffect } from 'react'
import { Switch } from "@/components/ui/switch"
import { useAppContext } from '@/app/Context/AppContext'
import useAudioControl from './useAudioControl'

export default function ToggleSounmd() {

    const { alertMe, setAlertMe } = useAppContext()
    const { mute, unmute } = useAudioControl();

    useEffect(() => {
        if (alertMe) {
            unmute();
        } else {
            mute();
        }
    }, [mute, unmute, alertMe])

    return (
        <div className="flex items-center space-x-2">
            <Switch onClick={() => setAlertMe(!alertMe)} id="airplane-mode" checked={alertMe} />
        </div>
    )
}
