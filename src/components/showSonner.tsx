"use client"
import { toast } from "sonner"

export const displaySooner = (message: string) => {
    const formattedDate = formatDate(new Date())
    toast(message, {
        description: formattedDate,
        duration: 5000,
        position: "top-right",
        action: {
            label: "Close",
            onClick: () => console.log("Undo"),
        },
    })
}

const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    }
    return date.toLocaleDateString('en-US', options)
}
