"use client"
import { EditProfile } from '@/components/EditProfile';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { checkValues, searchLocalStorage } from '@/scripts/check-user-auth';
import { UserProfile } from '@/scripts/types/dashboard';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { Label } from '@radix-ui/react-label';
import { Share } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const Page: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const userPresent: boolean = await checkValues();
      if (!userPresent) {
        window.location.href = '/signin';
      }

      const { authorization, userId } = searchLocalStorage();
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/profile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization,
            user_id: userId,
          },
        });

        const userData: UserProfile = await res.json();
        setUser(userData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }
  console.log(`${process.env.NEXT_PUBLIC_SERVER_URL}/i/${user.photo}`)

  return (
    <div className="container mx-auto mt-8 justify-center items-center">
      <div>
        <div className="flex flex-col gap-4 justify-between sm:flex-row">
          <div className="flex flex-col sm:flex-row gap-8">
            {/* <div> */}
            <img
              src={`${process.env.NEXT_PUBLIC_SERVER_URL}/i/${user.photo}`}
              alt="User Photo"
              className="rounded-full w-40 h-40 object-cover border-2 border-black"
            />
            {/* <p className='text-gray-500'>*random photo generated by Photo AI at SynthAI Labs</p> */}
            {/* </div> */}
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="mt-2 font-medium">{user.email}</p>
            </div>
          </div>
          <div className='flex flex-col sm:flex-row'>
            <div>
              <Button variant="ghost" onClick={
                () => {
                  navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_CLIENT_URL}/p/${user.id}`);
                  toast({
                    title: 'Link copied to clipboard',
                    description: "URL: " + `${process.env.NEXT_PUBLIC_CLIENT_URL}/p/${user.id}`,
                  });
                }
              }>
                <Share className="w-6 h-6" />
              </Button>
            </div>
            <div className="mt-4 sm:mt-0">
              <Dialog >
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-black text-white hover:bg-gray-900 hover:text-white">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-opacity-50 backdrop-filter backdrop-blur-md">
                  <EditProfile />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-6 min-w-full">
        <Card className="flex">
          <CardHeader>
            <CardTitle className="text-lg font-bold">About Me</CardTitle>
            <div className='mt-4 font-medium justify-center items-center flex mb'>
              {user.bio.length === 0 || user.bio === null || user.bio === undefined ? (
                <p>No bio set</p>
              ) : (
                <p className="">{user.bio}</p>
              )}
            </div>
          </CardHeader>
        </Card>

        <Card className="flex">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Interests</CardTitle>
            <div className='mt-4 font-medium justify-center items-center flex mb'>
              {user.bio.length === 0 || user.bio === null || user.bio === undefined ? (
                <p>No bio set</p>
              ) : (
                <p className="">{user.bio}</p>
              )}
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Course Enrollments:</h2>
        <ul className="flex flex-col gap-4 sm:flex-row">
          {user.CourseEnrollment.map((enrollment) => (
            <Card key={enrollment.id} className="max-w-sm">
              <CardHeader>
                <CardTitle>Course Name</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Course ID: {enrollment.courseId}</p>
                <p>Status: {enrollment.status}</p>
              </CardContent>
            </Card>
          ))}
        </ul>
      </div>

      <div className="mb-4 mt-8">
        <h2 className="text-2xl font-bold mb-4">Achievements:</h2>
        <ul className="flex flex-col gap-4 max-w-2xl">
          {user.achievements.map((achievement) => (
            <Card key={achievement.id} className="pt-6 bg-white rounded shadow">
              <CardContent><span className="font-bold">{achievement.name}:</span>{' '}
                {achievement.description}</CardContent>
            </Card>
          ))}
        </ul>
      </div>
    </div>
  )
}



export default Page;

// JOSN EXAMPLE:
// {
//     "id": 1,
//     "username": "user1",
//     "photo": "url_to_user1_photo.jpg",
//     "name": "User One",
//     "bio": "Bio for User One",
//     "email": "user1@example.com",
//     "password": "password1",
//     "emailVerified": true,
//     "role": "USER",
//     "token": "demo",
//     "interests": [],
//     "userSettingsId": 1,
//     "achievements": [
//       {
//         "id": 1,
//         "name": "Achievement 1",
//         "icon": "icon1.jpg",
//         "description": "Description for Achievement 1",
//         "courseId": 1,
//         "userId": 1
//       }
//     ],
//     "CourseEnrollment": [
//       {
//         "id": 1,
//         "userId": 1,
//         "courseId": 1,
//         "status": "COMPLETED",
//         "enrolledAt": "2023-12-21T15:32:45.558Z",
//         "completedAt": null
//       },
//       {
//         "id": 2,
//         "userId": 1,
//         "courseId": 2,
//         "status": "IN_PROGRESS",
//         "enrolledAt": "2023-12-21T15:32:45.561Z",
//         "completedAt": null
//       }
//     ],
//     "settings": {
//       "id": 1,
//       "userId": 1,
//       "publicProfile": true,
//       "publicEmail": false,
//       "publicBio": true,
//       "publicPhoto": true,
//       "publicName": true,
//       "publicInterests": true
//     }
//   }
