import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key'

export function generateToken(payload: object): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' }, (err, token) => {
      if (err) reject(err)
      else resolve(token as string)
    })
  })
}

export function verifyToken(token: string): Promise<object> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) reject(err)
      else resolve(decoded as object)
    })
  })
}
