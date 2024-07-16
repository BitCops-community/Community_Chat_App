"use client"
import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Cog } from 'lucide-react'
import Logout from './Logout'
import { ModeToggle } from './theme-changer'
import ToggleSounmd from './ToggleSounmd'
export default function Settings() {
    return (
        <div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline"><Cog /></Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Settings</h4>
                            <p className="text-sm text-muted-foreground">
                                Manage your account settings, preferences.
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="ChangeTheme">Change Theme</Label>
                                <ModeToggle />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="ChangeTheme">Notification Sound</Label>
                                <ToggleSounmd />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="logout">Logout</Label>
                                <Logout />
                            </div>

                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
