const resources = [
  {
    id: '0',
    name: 'Book',
    value: .25,
  },
  {
    id: '1',
    name: 'Food',
    value: .81,
  },
  {
    id: '2',
    name: 'Travel',
    value: .44,
  }
]

interface IResource {
  id: string
  name: string
  value: number
}

interface IDatabaseService {
  list: () => Promise<IResource[]>
  insert: (resource: IResource) => Promise<IResource[]>
}

class DatabaseService implements IDatabaseService {
  async list(): Promise<IResource[]> {
    return resources
  }

  async insert(resource: IResource): Promise<IResource[]> {
    resources.push(resource)
    return resources
  }
}

const database = new DatabaseService()

export default database
