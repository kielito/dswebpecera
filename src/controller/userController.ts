import {Request, Response} from 'express';
import userModel from '../models/userModel'; 
import flash from "connect-flash";

class UserController{

	public signin(req:Request,res:Response){
		console.log(req.body);
        res.render("partials/signinForm");
	}

    public async login(req: Request, res: Response) {
        const { usuario, password } = req.body; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const result = await userModel.buscarNombre(usuario);
        		
        if (!result){            
			req.flash('error','El Usuario no se encuentra registrado'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
			res.redirect("./signin");			
		} else {
			const correctPassword = await userModel.validarPassword(password, result.Password);
            console.log(result);
			if (correctPassword){
				req.session.user=result;
				req.session.auth=true;
				req.flash('confirmacion','Bienvenido ' + result.Nombre + '!!');
				res.redirect("./home");
				return;
			} else {					
				req.flash('error','Password Incorrecto'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
				res.redirect("./signin");
			}
        }
    }

    //registro
	public signup(req:Request,res:Response){
		console.log(req.body);        
		res.render("partials/signupForm");
	}
    
    public showError(req: Request, res: Response) {
        //res.send({ "Usuario y/o contraseña incorrectos": req.body }); // Paso 15
        res.render("partials/error"); // Paso 15

    }

    public home(req:Request,res:Response){
		console.log(req.body);
        // Paso 6 si no fue autenticado envialo a la ruta principal
        if(!req.session.auth){
            req.flash('error','Debes iniciar sesion para ver esta seccion!');
			res.redirect("./signin");
        }
        res.render("partials/home", { mi_session: true }); // Paso 18  debemos enviar mi_session en true para que se dibuje el boton	
	}

	//CRUD
	public async list(req:Request,res:Response){
		console.log(req.body);
        const usuarios = await userModel.listar();
        console.log(usuarios);
        return res.json(usuarios);
        //res.send('Listado de usuarios!!!');
	}

	public async find(req:Request,res:Response){
		console.log(req.params.id);
        const { id } = req.params;
        const usuario = await userModel.buscarId(id);
        if (usuario)
            return res.json(usuario);
        return req.flash('error', 'Usuario no existe!');         
	}

	public async addUser(req:Request,res:Response){
		const usuario = req.body;

		if(usuario.password !== usuario.repassword){
			req.flash('error','Verifique la clave ingresada!'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
			return res.redirect("./signup");
		}
		delete usuario.repassword;

        const busqueda = await userModel.buscarUsuario(usuario.usuario, usuario.email);		
		usuario.password = await userModel.encriptarPassword(usuario.password);
        console.log(busqueda);
        if (!busqueda) {
            const result = await userModel.crear(usuario);
			
			if (!result) 
				res.status(404).json({ text: "No se pudo crear el usuario" });
			req.flash('confirmacion','Usuario Registrado correctamente!');
			
            return res.redirect("./signin");
        }
		req.flash('error','El usuario y/o email ya se encuentra registrado!'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
		return res.redirect("./signup");
	}

	public async update(req:Request,res:Response){
        if(!req.session.auth){
            req.flash('error','Debe iniciar sesion para ver esta seccion'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
			res.redirect("../signin");
        }

        const { id } = req.params;		
		const usuario = await userModel.buscarId(id);

		req.body.password = await userModel.encriptarPassword(req.body.password);
        const result = await userModel.actualizar(req.body, id);
        
		if(result) {			
		req.flash('confirmacion','Usuario "' + req.body.nombre + '" actualizado correctamente!');			
        return res.redirect("../control");
		}
		
		req.flash('error','El usuario y/o email ya se encuentra registrado!'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
		return res.render("partials/update",{usuario, home:req.session.user, mi_session:true});		
	}

	public async delete(req:Request,res:Response){
		if(!req.session.auth){
            req.flash('error','Debe iniciar sesion para ver esta seccion'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
			res.redirect("../signin");
        }
        
        const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const result = await userModel.eliminar(id);
        console.log(req.body);
		req.flash('confirmacion','Se eliminó el Usuario correctamente!');			
		res.redirect('../control');
	}
	//FIN CRUD

	public async control(req:Request,res:Response){
        if(!req.session.auth){
            req.flash('error','Debe iniciar sesion para ver esta seccion'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
			res.redirect("./signin");
        }
        const usuarios = await userModel.listar();       
        res.render('partials/controls', { users: usuarios, mi_session:true });	
	}

	public async procesar(req:Request,res:Response){
        if(!req.session.auth){            
			req.flash('error','Debes iniciar sesion para ver esta seccion');
			return res.redirect("../signin");
        }

		const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const usuario = await userModel.buscarId(id);

        if(usuario !== undefined){            
			res.render("partials/update",{usuario, home:req.session.user, mi_session:true});
        }
	}

    // cierre de sesion
    public endSession(req: Request, res: Response) {        
        req.session.user = {};
        req.session.auth = false;
        req.session.destroy(() => console.log("Session finalizada"));
        res.redirect("/");
    }
}

const userController = new UserController(); 
export default userController;