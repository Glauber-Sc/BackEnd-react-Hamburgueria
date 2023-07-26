import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";

import ProductController from "./app/controllers/ProductController";
import SessionController from "./app/controllers/SessionController";
import CategoryController from "./app/controllers/CategoryController";
import UserController from "./app/controllers/UserController";
import OrderController from "./app/controllers/OrderController";

import authMiddleware from "./app/middlewares/auth";
/* import { route } from 'express/lib/application' */

const upload = multer(multerConfig);

const routes = new Router();

routes.post("/users", UserController.store); // Cria novo usuario

routes.post("/sessions", SessionController.store); // Cria nova seção de produtos

routes.use(authMiddleware); // Todas as rotas que estiverem abaixo vão receber o middleware

//cria-se primeiro categorias antes de criar produtos
routes.post("/categories", upload.single("file"), CategoryController.store); // Rota para criar nova categoria
routes.get("/categories", CategoryController.index);
routes.put("/categories/:id", upload.single("file"), CategoryController.update); // Rota para editar categoria
routes.delete('/categories/:id', CategoryController.delete) // deletar produtos por ID

//cria-se produtos antes de realizar pedidos(orders)
routes.post("/products", upload.single("file"), ProductController.store); // Cria novo produto
routes.get("/products", ProductController.index); // Mostra todos os produtos
routes.put("/products/:id", upload.single("file"), ProductController.update); // Rota de para editar de produto
routes.delete('/products/:id', ProductController.delete) // deletar produtos por ID

routes.post('/orders', OrderController.store) // Cria novo pedido
routes.put('/orders/:id', OrderController.update) // Atualiza o status do pedido
routes.get('/orders', OrderController.index) // Mostra todos os pedidos





export default routes;
