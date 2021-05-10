import { Router, Request, Response } from 'express';
import userController from '../controller/userController';
import { validateRequestSchema } from '../lib/validation';
import { registerSchema } from '../lib/register-schema';

class UserRoutes{
	public router: Router = Router();
	constructor(){
		this.config();
	}
	config():void{
        // se asocian rutas con el metodo de una clase existente:
		this.router.get('/',(req:Request,res:Response)=> {          
            req.session.auth=false;
            req.session.user={};
            res.render("partials/signinForm");               
        });

       // inicio de sesion
        this.router.get('/signin',userController.signin); 
        this.router.post('/signin',userController.login);

        // registro
		this.router.get('/signup',userController.signup);
		this.router.post('/signup',registerSchema,validateRequestSchema,userController.addUser);

        //Home del usuario		
        this.router.get('/home',userController.home);

        //CRUD
        this.router.get('/list',userController.list);
        this.router.get('/find/:id',userController.find);
        this.router.post('/add',userController.addUser);
        this.router.put('/update/:id',userController.update);
        /*
        this.router.get('/update/:id',userController.update); // tarea dibujo vista
        this.router.post('/update/:id',userController.update); // tarea update x saveChanges ejecuta update bd
        */
        this.router.delete('/delete/:id',userController.delete);
        this.router.get('/delete/:id',userController.delete);
        // FIN CRUD

        this.router.get('/control',userController.control);
        this.router.post('/procesar',userController.procesar);        
        this.router.get('/salir',userController.endSession);
        this.router.get('/error',userController.showError);        
	}
}

//Exportamos el enrutador con 
const userRoutes = new UserRoutes();
export default userRoutes.router;