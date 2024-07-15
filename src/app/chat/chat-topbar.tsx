import React from 'react'
import { Avatar, AvatarImage } from '../../components/ui/avatar'
import UsersCount from '@/components/UsersCount'

import { ModeToggle } from '@/components/theme-changer'


export default function ChatTopbar() {
  return (
    <div className="w-full h-20 flex p-4 justify-between items-center border-b">
      <div className="flex items-center gap-2">
        <Avatar className="flex bg-black justify-center items-center">
          <AvatarImage
            src={"/Bitcops-logo-light.png"}
            alt={"logo"}
            width={6}
            height={6}
            className="w-10 h-10 "
          />
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">Bitcops Community</span>
          <UsersCount />
        </div>
      </div>

      <ModeToggle />

    </div>
  )
}
