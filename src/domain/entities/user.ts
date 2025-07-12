export class User {
  private readonly id: string
  private readonly name: string

  constructor(
    id: string, 
    name: string
  ) {
    this.validateUser(id, name)

    this.id = id
    this.name = name
  }

  private validateUser(id: string, name: string) {
    if (!id?.length) {
      throw Error('O id é obrigatório')
    }
    
    if (!name?.length) {
      throw Error('O nome é obrigatório')
    }
  }

  getId() {
    return this.id
  }

  getName() {
    return this.name
  }
}