import React from 'react'
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

const HomeCard = ({ user, setMode, setCreateUserModal }) => {
    const handleUpdateClick = () => {
        setCreateUserModal(true)
        setMode("update");
        fetchUserById(user._id);
      };
    return (
        <Card className="w-[23%] min-w-52 ">
            <CardHeader>
                <CardTitle>{user.first_name} {user.last_name}</CardTitle>
                <CardDescription className="text-slate-400">{user.email}</CardDescription>
            </CardHeader>
            <div className='flex gap-5'>
                <CardContent>
                    <p>{user.gender}</p>
                </CardContent>
                <Avatar >
                    <AvatarImage src={user.avatar} className="z-5"/>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
            <CardFooter>
                <div className='flex gap-4 items-center justify-between mt-4 w-full'>
                    <p>{user.domain}</p>
                    <Button onClick={handleUpdateClick} className="p-2 py-0 bg-purple-700 hover:bg-purple-900">Update</Button>
                </div>
            </CardFooter>
        </Card>
    )
}

export default HomeCard
