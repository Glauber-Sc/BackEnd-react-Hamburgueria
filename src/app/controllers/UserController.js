/* O controller é onde as informações vão entrar na aplicação. O controller vai manipular essas informações fazer algumas validações e depois chamar o Model pra gravar as informações no banco de dados */

/* import { response } from 'express' */
import { v4 } from 'uuid'
import * as Yup from 'yup' // Yup valida os dados. O * representa todos os arquivos que devem ser exportados do Yup

import User from '../models/User'

class UserController {
    async store(request, response) {
        // O metodo store vai cadastrar o novo usuario

        // Validando informações
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
            admin: Yup.boolean()
        })

        /* if(!(await schema.isValid(request.body))){
            return response
                .status(400)
                .json({error: "Make sure your data is correct"})
        } */

        try {
            // Verifica as informações e retorna o erro
            await schema.validateSync(request.body, { abortEarly: false })
        } catch (err) {
            return response.status(400).json({ error: err.errors })
        }

        const { name, email, password, admin } = request.body

        // Verificando se um email já existe
        const userExists = await User.findOne({
            where: { email: email }
        })

        if (userExists) {
            return response.status(409).json({ error: 'User already exists' })
        }

        console.log(userExists)

        const user = await User.create({
          
            name,
            email,
            password,
            admin
        })

        return response.status(201).json({  name, email, admin })
    }
}

export default new UserController()
