import React from 'react'

import UsersList from '../components/UsersList/UsersList'

const Users = () => {

  const USERS = [{
    id: 'u1',
    name: 'John',
    image: 'https://randomuser.me/api/portraits/men/75.jpg',
    places: 3
  }]

  return <UsersList items={USERS} />
}

export default Users