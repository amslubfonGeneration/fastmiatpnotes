import fastifyFormbody from "@fastify/formbody"
import fastifySecureSession from "@fastify/secure-session"
import fastifyStatic from "@fastify/static"
import fastifyView from "@fastify/view"
import fastify from "fastify"
import ejs from 'ejs'
import fs from 'node:fs'
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import {administrerGet, connectGet, consulterGet, newPasswordGet, supprimerGet, viderGet} from "./getaction.js"
import { newPasswordPost, traitementMailPost } from "./emailaction.js"
import { administrerPost, connectPost, consulterPost, supprimerPost, viderPost } from './postaction.js'
import { recordNotBase, recordNotFound } from "../error/recordNotFound.js"


const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
const app = fastify({logger:true})
app.register(fastifyView,{
    engine: {
        ejs
    }
})
app.register(fastifyStatic, {
    root:join(rootDir,'public')
})
app.register(fastifyFormbody)
app.register(fastifySecureSession,{
    cookieName: 'session',
    key: fs.readFileSync(join(rootDir, 'secret-key')),
    cookie: {
        path:'/'
    }
})

app.get('/administration',administrerGet) 
app.get('/supprimer', supprimerGet)
app.get('/vider',viderGet)
app.get('/newPassword',newPasswordGet)
app.get('/connect', connectGet)
app.get('/consulter', consulterGet)
//Methode post
app.post('/newPassword', newPasswordPost)
app.post('/vider', viderPost)
app.post('/administration', administrerPost)
app.post('/supprimer', supprimerPost)
app.post('/connect', connectPost)
app.post('/consulter', consulterPost)
app.post('/traitementMail', traitementMailPost)
//Getion des erreurs de l'Api
app.setErrorHandler((error,req,res) => {
    if(error instanceof recordNotFound){
        res.statusCode = 404
        return res.view("template/404.ejs",{
            error: error.message
        })
    }if(error instanceof recordNotBase){
        res.statusCode = 404
        return res.view('template/404.ejs',{
            error:error.message
        })
    }
    if(error.message === "UNIQUE constraint failed: etudiants.matricule"){
        return res.view("/template/administration.ejs", {
            error_1: "Vous avez entrez un matricule invalide."
        })
    }
    console.error(error)
    res.statusCode = 500
    return {
        error: error.message  
    }
})

export default async(req, res)=>{
    try{
        await app.ready()
        app.server.emit('request',req,res)
    }catch(error){
        console.error("Erreur de démarrage du serveur:",error)
        res.status(500).send('Erreur serveur interne')
    }
}
