import { recordNotBase } from "../error/recordNotFound.js";
import { supabase } from "./database.js";


export const viderGet =  (req, res)=>{
    if(req.session.get('user') === undefined || req.session.get('user') === null){
        return res.view('template/404.ejs',{
            error:"Page introuvable"
        })
    }else{
        return res.view('template/connect.ejs',{
              connect:"connecter"
        })
    }
}

export const connectGet = (req, res)=>{
    if(req.session.get('user') === undefined || req.session.get('user') === null){
        res.view('template/connect.ejs')
    }else{
        return res.view('template/connect.ejs',{
            connect:"connecter"
        })
    }
}

export const newPasswordGet = (req, res)=>{
    if(req.session.get('user') === undefined || req.session.get('user') === null){
        res.view('template/connect.ejs')
    }else{
        return res.view('template/connect.ejs',{
            connect:"connecter"
        })
    }
}

export const consulterGet = async (req, res) => {
    const { data: posts, error: postsError } = await supabase
            .from('etudiants')
            .select('*');
    if(postsError){
        throw new recordNotBase("Il est survenu un probleme.")
    }
    posts.sort((a,b) => {
        return b.Note - a.Note
    })
    return res.view("template/consulter.ejs",{
        posts
    })
}


export const administrerGet = (req, res)=>{
    if(req.session.get('user') === undefined || req.session.get('user') === null){
        return res.view('template/404.ejs',{
            error: 'Page introuvable'
    })
    }else{
        return res.view('template/administration.ejs',{
            option1:"delete",
            connect:"connecté"
        })
    }
}

export const supprimerGet = (req, res)=>{
    if(req.session.get('user') === undefined || req.session.get('user') === null){
        return res.view('template/404.ejs',{
            error: 'Page introuvable'
        })
    }else{
        return res.view('/template/administration.ejs',{
            option2:"delete",
            connect:"connecter"
        })
    }
}