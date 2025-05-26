import {
    GithubIcon,
    LinkedinIcon,
    InstagramIcon,
    YoutubeIcon,
    SparklesIcon,
    PencilLineIcon,
    NavigationIcon,
    BookmarkIcon,
    ImagesIcon,
    ShipWheelIcon,
  } from 'lucide-react'

export const LINKS = [
    {
      href: '/',
      label: 'Home',
      icon: <SparklesIcon size={24} />
    },
    {
      href: '/projects',
      label: 'Projects',
      icon: <NavigationIcon size={24} />
    },
    {
      href: '/writing',
      label: 'Writing',
      icon: <PencilLineIcon size={24} />
    },
    {
      href: '/travel',
      label: 'Travel',
      icon: <ShipWheelIcon size={24} />
    },
    {
        href: '/gallery',
        label: 'Gallery',
        icon: <ImagesIcon size={24} />
    },
]


  export const PROFILES = {
    github: {
      title: 'GitHub',
      url: 'https://github.com/gokiberk',
      icon: <GithubIcon size={24} />
    },
    linkedin: {
      title: 'LinkedIn',
      url: 'https://www.linkedin.com/in/gokberkkeskinkilic',
      icon: <LinkedinIcon size={24} />
    },
    medium: {
      title: 'Pexels',
      url: 'https://www.pexels.com/@gokiberk/',
      icon: <BookmarkIcon size={24} />
    },
    instagram: {
      title: 'Instagram',
      url: 'https://www.instagram.com/gokiberk',
      icon: <InstagramIcon size={24} />
    }
  }
  