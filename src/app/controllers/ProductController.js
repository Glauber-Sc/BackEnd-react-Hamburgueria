import * as Yup from "yup";
import Product from "../models/Product";
import Category from "../models/Category";
import User from "../models/User";

class ProductController {
    async store(request, response) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            price: Yup.number().required(),
            category_id: Yup.number().required(),
            offer: Yup.boolean(),
            description: Yup.string().required(), // Adicionando o campo description na validação e tornando-o obrigatório
        });

        try {
            await schema.validate(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const { filename: path } = request.file;
        const { name, price, category_id, offer, description } = request.body;

        try {
            const product = await Product.create({
                name,
                price,
                category_id,
                path,
                offer,
                description, // Salvando o campo description no banco de dados
            });

            return response.status(201).json(product);
        } catch (err) {
            return response
                .status(500)
                .json({ error: "Failed to create product" });
        }
    }

    // Essa rota retorna todos os produtos
    async index(request, response) {
        const products = await Product.findAll({
            include: [
                {
                    model: Category,
                    as: "category",
                    attributes: ["id", "name"],
                },
            ],
        });

        console.log(request.userId);
        return response.json(products);
    }

    /* Metodo para editar produto */
    async update(request, response) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            price: Yup.number(),
            category_id: Yup.number(),
            offer: Yup.boolean(),
            description: Yup.string(), // Adicionando o campo description na validação
        });

        try {
            await schema.validate(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const { id } = request.params;

        try {
            const product = await Product.findByPk(id);

            if (!product) {
                return response
                    .status(404)
                    .json({ error: "Product not found with the provided ID" });
            }

            let { name, price, category_id, offer, description } = request.body;

            // Verificando se o campo description foi enviado no corpo da requisição
            if (!description) {
                description = product.description; // Mantendo o valor atual do campo description caso não tenha sido enviado no corpo da requisição
            }

            const updatedProduct = await product.update({
                name,
                price,
                category_id,
                offer,
                description, // Atualizando o campo description no banco de dados
            });

            return response.status(200).json(updatedProduct);
        } catch (err) {
            return response
                .status(500)
                .json({ error: "Failed to update product" });
        }
    }

    async delete(request, response) {
        const { id } = request.params;

        try {
            const product = await Product.findByPk(id);

            if (!product) {
                return response
                    .status(404)
                    .json({ error: "Product not found with the provided ID" });
            }

            await product.destroy();

            return response.status(204).json();
        } catch (err) {
            return response
                .status(500)
                .json({ error: "Failed to delete product" });
        }
    }
}

export default new ProductController();
