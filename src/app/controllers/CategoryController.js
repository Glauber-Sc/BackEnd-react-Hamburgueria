/* Controller de Categorias. É aqui que vai chegar os dados */

import * as Yup from "yup";
import Category from "../models/Category";
import User from "../models/User";

// Validação dos produtos
class CategoryController {
    async store(request, response) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required(),
            });

            try {
                //  Teste para verificar as informações e retorna o erro
                await schema.validateSync(request.body, { abortEarly: false });
            } catch (err) {
                return response.status(400).json({ error: err.errors });
            }

            // Definido que só administradores podem criar uma nova categoria.
            // Verificando se o usuario é admin
            const { admin: isAdmin } = await User.findByPk(request.userId);

            if (!isAdmin) {
                return response.status(401).json();
            }

            const { name } = request.body;

            //essa parte do codigo foi alterado. esse e o codigo original e estara comentado para testes
            const { filename: path } = request.file;

            //esse e o cidigo alterado para o teste no insominia, nao e o codigo original.
            //const { filename: path } = request.file || {};

            // Validando categoria repetida
            const categoryExists = await Category.findOne({
                where: {
                    name,
                },
            });

            if (categoryExists) {
                return response
                    .status(400)
                    .json({ error: "Categoria já existente" });
            }

            // Criando nova categoria
            const { id } = await Category.create({ name, path });

            return response.json({ name, id });
        } catch (err) {
            console.log(err);
        }
    }

    // Essa rota retorna todos os produtos
    async index(request, response) {
        const category = await Category.findAll();

        return response.json(category);
    }

    async update(request, response) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string(),
            });

            try {
                //  Teste para verificar as informações e retorna o erro
                await schema.validateSync(request.body, { abortEarly: false });
            } catch (err) {
                return response.status(400).json({ error: err.errors });
            }

            // Definido que só administradores podem criar uma nova categoria.
            // Verificando se o usuario é admin
            const { admin: isAdmin } = await User.findByPk(request.userId);

            if (!isAdmin) {
                return response.status(401).json();
            }

            const { name } = request.body;

            const { id } = request.params;

            // Verificando se categoria existe
            const category = await Category.findByPk(id);

            if (!category) {
                return response
                    .status(401)
                    .json({ error: "Make sure your category id is correct" });
            }

            let path;
            if (request.file) {
                path = request.file.filename;
            }

            // Atualizando categoria
            await Category.update({ name, path }, { where: { id } });

            return response.status(200).json();
        } catch (err) {
            console.log(err);
        }
    }

    async delete(request, response) {
        try {
            // Verificando se o usuário é um administrador
            const { admin: isAdmin } = await User.findByPk(request.userId);

            if (!isAdmin) {
                return response
                    .status(401)
                    .json({
                        error: "Apenas administradores podem excluir categorias.",
                    });
            }

            const { id } = request.params;

            // Verificando se a categoria existe
            const category = await Category.findByPk(id);

            if (!category) {
                return response
                    .status(404)
                    .json({ error: "Categoria não encontrada." });
            }

            // Excluindo a categoria
            await category.destroy();

            return response.status(204).send();
        } catch (error) {
            console.error(error);
            return response
                .status(500)
                .json({ error: "Falha ao excluir a categoria." });
        }
    }
}

export default new CategoryController();
