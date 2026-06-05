export type UserProps = {
  id: string
  email: string
  name: string
  createdAt: Date
}

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: { id: string; email: string; name: string }): User {
    if (!props.email.includes('@')) {
      throw new Error('Invalid email')
    }

    if (!props.name.trim()) {
      throw new Error('User name is required')
    }

    return new User({
      id: props.id,
      email: props.email,
      name: props.name,
      createdAt: new Date()
    })
  }

  get id() {
    return this.props.id
  }

  get email() {
    return this.props.email
  }

  get name() {
    return this.props.name
  }

  get createdAt() {
    return this.props.createdAt
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt
    }
  }
}
