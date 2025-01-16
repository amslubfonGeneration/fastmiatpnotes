import nodemailer from 'nodemailer'
import { supabase } from './database.js';
import { recordNotBase } from '../error/recordNotFound.js';
import { email_pass, email_to, email_user } from './config.js';
import { hash } from '@phc/argon2';

const transporte = nodemailer.createTransport({
  service: 'gmail',
  host:'smtp.gmail.com',
  port: 587,
  secure:false,
  auth: {
    user: email_user,
    pass: email_pass,
  },
})


export const traitementMailPost = async (req, res) => {
    const { Nom, prenom,matricule, email, contact, commentaire } = req.body
    try {
    // Envoyer un e-mail avec Nodemailer
    await transporte.sendMail({
        from: `"Formulaire de contact" <${email_user}>`,
        to: email_to,
        subject: 'Réclammation des notes de tp', // Sujet de l'e-mail
            text: `Nom: ${Nom}\nPrénom: ${prenom}\nMatricule: ${matricule}\nEmail: ${email}\nContact: ${contact}\nMessage: ${commentaire}`, // Contenu en texte brut
            html: `<p><strong>Nom:</strong> ${Nom}</p>
                    <p><strong>Prénom(s):</strong> ${prenom}</p>
                     <p><strong>Marticule:</strong> ${matricule}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Contact:</strong> ${contact}</p>
                    <p><strong>Message:</strong> ${commentaire}</p>`,
    });

    return res.view('template/email.ejs', {
        message: `${Nom} ${prenom}, votre message a été envoyé avec succes`
    })
    }catch (error) {
        console.error(error);
        return res.view('template/404.ejs',{
            mailerror: "Une erreur s'est produite lors de l'envoie de votre message.Vérifier votre connexion"
        })
    }
}

export const newPasswordPost = async (req, res)=>{
    if(req.session.get('user') === undefined || req.session.get('user') === null){
        return res.view('template/404.ejs',{
            error: "Impossible de changer mot de pass.Connecter vous a l'administration"
    })}else{
        req.session.delete()
        const { id, password } = req.body
        try {
        // Envoyer un e-mail avec Nodemailer
        await transporte.sendMail({
            from: `"Mettre a jours password" <${email_user}>`,
            to: email_to,
            subject: 'Mettre a jours password', // Sujet de l'e-mail
                text: `administration_id: ${id}\n Nouveau mot de pass: ${password}`, // Contenu en texte brut
                html: `<p><strong>administration_id:</strong> ${id}</p>
                        <p><strong>password:</strong> ${password}</p>`,
        })  
            const { error: deleteError } = await supabase
            .from('administration')
            .delete()
            .neq('administration_id')
            if(deleteError){
                    console.log(deleteError)
                    return res.view("template/404.ejs",{
                        error:"Une erreur s'est produite. Réessayer" 
                    })
            }else{
                const { error: insertError } = await supabase
                .from('administration')
                .insert([
                {
                        administration_id: req.body.id,
                        password: await hash(req.body.password)
                }])
                if(insertError){
                    throw new recordNotBase("Il est survenu un probleme.")
                }
                    return res.view('template/email.ejs', {
                    message: `Mise a jours de mot de pass reussit`
                })
            }
        }catch (error) {
            console.error(error);
            return res.view('template/404.ejs',{
                mailerror: "Une erreur s'est produite lors de l'envoie de votre message.Vérifier votre connexion"
            })
        }
    }
}