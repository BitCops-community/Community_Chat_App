"use client"
import React from 'react'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useAppContext } from '@/app/Context/AppContext'

export default function ToggleSounmd() {

    const { alertMe, setAlertMe } = useAppContext()

    return (
        <div className="flex items-center space-x-2">
            <Switch onClick={() => setAlertMe(!alertMe)} id="airplane-mode" checked={alertMe} />
        </div>
    )
}
