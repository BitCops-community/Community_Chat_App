"use client"
import { useAppContext } from '@/app/Context/AppContext'
import React from 'react'

export default function UsersCount() {
    const { liveUsers } = useAppContext()
    return (
        <div>
            <span className="text-xs">{liveUsers} Active Users</span>
        </div>
    )
}
