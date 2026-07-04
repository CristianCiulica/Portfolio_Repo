import { Suspense } from 'react'
import { Shell } from './Shell'
import { Doors } from './Doors'
import { Lighting } from './Lighting'
import { Exterior } from './Exterior'
import { Lobby, AboutRoom, ProjectsHall, NorthGallery, ContactRoom, SecretRoom } from './Rooms'

export function Museum() {
  return (
    <group>
      <Lighting />
      <Shell />
      <Doors />
      <Exterior />
      <Suspense fallback={null}>
        <Lobby />
        <AboutRoom />
        <ProjectsHall />
        <NorthGallery />
        <ContactRoom />
        <SecretRoom />
      </Suspense>
    </group>
  )
}
