"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
class UserController {
    signin(req, res) {
        console.log(req.body);
        res.render("partials/signinForm");
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario, password } = req.body; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
            const result = yield userModel_1.default.buscarNombre(usuario);
            if (!result) {
                req.flash('error', 'El Usuario no se encuentra registrado'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
                res.redirect("./signin");
            }
            else {
                const correctPassword = yield userModel_1.default.validarPassword(password, result.Password);
                console.log(result);
                if (correctPassword) {
                    req.session.user = result;
                    req.session.auth = true;
                    req.flash('confirmacion', 'Bienvenido ' + result.Nombre + '!!');
                    res.redirect("./home");
                    return;
                }
                else {
                    req.flash('error', 'Password Incorrecto'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
                    res.redirect("./signin");
                }
            }
        });
    }
    //registro
    signup(req, res) {
        console.log(req.body);
        res.render("partials/signupForm");
    }
    showError(req, res) {
        //res.send({ "Usuario y/o contraseña incorrectos": req.body }); // Paso 15
        res.render("partials/error"); // Paso 15
    }
    home(req, res) {
        console.log(req.body);
        // Paso 6 si no fue autenticado envialo a la ruta principal
        if (!req.session.auth) {
            req.flash('error', 'Debes iniciar sesion para ver esta seccion!');
            res.redirect("./signin");
        }
        res.render("partials/home", { mi_session: true }); // Paso 18  debemos enviar mi_session en true para que se dibuje el boton	
    }
    //CRUD
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const usuarios = yield userModel_1.default.listar();
            console.log(usuarios);
            return res.json(usuarios);
            //res.send('Listado de usuarios!!!');
        });
    }
    find(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.params.id);
            const { id } = req.params;
            const usuario = yield userModel_1.default.buscarId(id);
            if (usuario)
                return res.json(usuario);
            return req.flash('error', 'Usuario no existe!');
        });
    }
    addUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = req.body;
            if (usuario.password !== usuario.repassword) {
                req.flash('error', 'Verifique la clave ingresada!'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
                return res.redirect("./signup");
            }
            delete usuario.repassword;
            const busqueda = yield userModel_1.default.buscarUsuario(usuario.usuario, usuario.email);
            usuario.password = yield userModel_1.default.encriptarPassword(usuario.password);
            console.log(busqueda);
            if (!busqueda) {
                const result = yield userModel_1.default.crear(usuario);
                if (!result)
                    res.status(404).json({ text: "No se pudo crear el usuario" });
                req.flash('confirmacion', 'Usuario Registrado correctamente!');
                return res.redirect("./signin");
            }
            req.flash('error', 'El usuario y/o email ya se encuentra registrado!'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
            return res.redirect("./signup");
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                req.flash('error', 'Debe iniciar sesion para ver esta seccion'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
                res.redirect("../signin");
            }
            const { id } = req.params;
            const usuario = yield userModel_1.default.buscarId(id);
            req.body.password = yield userModel_1.default.encriptarPassword(req.body.password);
            const result = yield userModel_1.default.actualizar(req.body, id);
            if (result) {
                req.flash('confirmacion', 'Usuario "' + req.body.nombre + '" actualizado correctamente!');
                return res.redirect("../control");
            }
            req.flash('error', 'El usuario y/o email ya se encuentra registrado!'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
            return res.render("partials/update", { usuario, home: req.session.user, mi_session: true });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                req.flash('error', 'Debe iniciar sesion para ver esta seccion'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
                res.redirect("../signin");
            }
            const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
            const result = yield userModel_1.default.eliminar(id);
            console.log(req.body);
            req.flash('confirmacion', 'Se eliminó el Usuario correctamente!');
            res.redirect('../control');
        });
    }
    //FIN CRUD
    control(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                req.flash('error', 'Debe iniciar sesion para ver esta seccion'); //Dos parametros: primero variable, segundo el valor que tendra esa variable
                res.redirect("./signin");
            }
            const usuarios = yield userModel_1.default.listar();
            res.render('partials/controls', { users: usuarios, mi_session: true });
        });
    }
    procesar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                req.flash('error', 'Debes iniciar sesion para ver esta seccion');
                return res.redirect("../signin");
            }
            const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
            const usuario = yield userModel_1.default.buscarId(id);
            if (usuario !== undefined) {
                res.render("partials/update", { usuario, home: req.session.user, mi_session: true });
            }
        });
    }
    // cierre de sesion
    endSession(req, res) {
        req.session.user = {};
        req.session.auth = false;
        req.session.destroy(() => console.log("Session finalizada"));
        res.redirect("/");
    }
}
const userController = new UserController();
exports.default = userController;
//# sourceMappingURL=userController.js.map