import dotenv from 'dotenv'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

export const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))

dotenv.config({
    path: join(rootDir, 'fichier.env'),
    debug: true,
    encoding: 'utf8'
})
export const email_to = process.env.EMAIL_TO
export const email_user = process.env.EMAIL_USER
export const email_pass = process.env.EMAIL_PASS
export const supabase_url = process.env.SUPABASE_URL
export const supabase_key = process.env.SUPABASE_KEY
export const PORT = process.env.PORT
