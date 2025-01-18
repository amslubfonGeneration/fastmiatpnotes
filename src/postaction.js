import {verify} from '@phc/argon2'
import { supabase } from './database.js';
import { recordNotBase, recordNotFound } from '../error/recordNotFound.js'

export const connectPost = async (req,res)=>{
        const { data: admis, error: admisError } = await supabase
            .from('administration')
            .select('*')
            .eq('administration_id', req.body.id)
            .single();
        if(admisError){
            throw new recordNotBase("Il est survenu un probleme.")
        }
        if(
            admis !== undefined && 
            await verify(admis.password, req.body.password)
        ){ 
            req.session.set('user', {
                id: admis.id
            })
            return res.view('template/email.ejs',{
                connect:"Vous etes connecter a l'administration"
            })
        }else{
            const error = "Impossible de se connecter a l'administration"
            return res.view('template/connect.ejs',{
                error,
            })
        }
}
//Fonction destinée a inserer les information des apprenants
export const administrerPost = async (req,res)=>{
    const { data: admis, error: admisError } = await supabase
            .from('administration')
            .select('*');
    if(admisError){
        throw new recordNotBase("Il est survenu un probleme.")
    }
    if(await verify(admis[0].password, req.body.password)){ 
        const { error: insertError } = await supabase
            .from('etudiants')
            .insert([
                {
                    matricule: req.body.matricule,
                    nom: req.body.Nom,
                    prenoms: req.body.prenom,
                    email: req.body.email,
                    Note: req.body.note
                }
            ]);
        if(insertError){
            throw new recordNotBase("Il est survenu un probleme.")
        }   
            console.log(req.body.Nom,req.body.Note)
            return res.view('template/email.ejs',{
                message:`L'Etudiant ${req.body.Nom} ${req.body.prenom} a bien été ajouté`
            })
    }else{
        return res.view('template/404.ejs',{
            error:"Mots de pass incorrect"
        })
    }
}
export const supprimerPost = async (req, res) =>{
        const { data: admis, error: admisError } = await supabase
            .from('administration')
            .select('*');
        if(admisError){
            throw new recordNotBase("Il est survenu un probleme.")
        }
        if(await verify(admis[0].password, req.body.password)){  
            const { error: deleteError } = await supabase
            .from('etudiants')
            .delete()
            .eq('matricule', req.body.matricule);
            if(deleteError){
                return res.view("template/404.ejs",{
                    error:"L'etudiant n'existe pas"   
            })}else{
                return res.view('template/email.ejs',{
                    message:`L'Etudiant ${req.body.Nom} ${req.body.prenom} a bien été supprimer`
                })
            }
        }else{
            return res.view('template/404.ejs',{
                error:"Mots de pass incorrect"
            })
        }
}

//Fonction pour supprimer des etudiant.
export const viderPost = async (req, res) =>{
        const { data: admis, error: admisError } = await supabase
            .from('administration')
            .select('*')
            .eq('administration_id', req.body.id)
            .single();
        if(admisError){
            throw new recordNotBase("Il est survenu un probleme.")
        }
        if(
                admis !== undefined && 
                await verify(admis.password, req.body.password)
        ){  
            const { data, error} = await supabase
                .from('etudiants')
                .select('*')
                console.log(data)
            for(var i = 0; i < data.length; i++){
                const { error: deleteError } = await supabase
                    .from('etudiants')
                    .delete()
                    .neq('matricule', data[i].matricule)
                if(deleteError){
                    throw new recordNotBase("Une erreur s'est produite Réesayer")
                }
            }
                return res.view('template/email.ejs',{
                    message:"Vous venez de vider la base de donnée."
                })
        }else{
            return res.view('template/404.ejs',{
                error:"Vous n'avez pas d'autorisation de vider la base.Réesayer"
            })
        }
}
export const consulterPost = async (req,res) =>{
    const { data: recherche, error: rechercheError } = await supabase
            .from('etudiants')
            .select('*');
    if(rechercheError){
        throw new recordNotBase("Il est survenu un probleme.")
    }
    if(recherche == undefined){
        throw new recordNotFound('Matricule invalide')
    }else{
        return res.view('template/consulter.ejs',{
            recherche: recherche[0]
        })
    }
}



