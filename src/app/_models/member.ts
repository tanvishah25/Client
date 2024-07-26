import {Photo} from "./Photo"

export interface Member {
    id: number
    userName: string
    age: number
    photoUrl: string
    knownAs: string
    created: Date
    lastActive: string
    gender: string
    introduction: string
    interests: string
    lookingFor: string
    city: string
    country: string
    photos: Photo[]
  }
