import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '../button'
const TeamCard = ({ team }) => {
  const userList = team.users
  return (
    <div className='w-full flex flex-wrap h-auto mb-4'>
      <div className='w-[100%] h-[4rem] '>
        <Card className="min-w-[14rem]">
          <CardHeader className="p-3">
            <CardTitle>{team.team_name}</CardTitle>
            <CardDescription className="text-slate-400">{team.team_tagline}</CardDescription>
          </CardHeader>
          <div className='flex '>
            {
              userList.map((user, index) => (
                <Avatar key={index} className="mb-2">
                  <AvatarImage src={user.avatar} className="z-5" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              ))
            }

          </div>
        </Card>
      </div>
    </div>
  )
}

export default TeamCard
