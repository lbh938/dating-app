export const siteConfig = {
  name: 'TSLover',
  description: "Trouvez l'amour avec TSLover",
  url: 'https://tslover.com',
  ogImage: 'https://tslover.com/og.jpg',
  links: {
    twitter: 'https://twitter.com/tslover',
    github: 'https://github.com/tslover'
  },
  mainNav: [
    {
      title: 'Accueil',
      href: '/'
    },
    {
      title: 'Swipe',
      href: '/swipe'
    },
    {
      title: 'Live',
      href: '/stream'
    },
    {
      title: 'Chat',
      href: '/chat'
    }
  ]
}

export default siteConfig

export type SiteConfig = typeof siteConfig 