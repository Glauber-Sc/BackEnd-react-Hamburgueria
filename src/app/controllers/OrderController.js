import * as Yup from "yup";
import Order from "../models/Order";
import Product from "../models/Product";
import User from "../models/User";
import OrderItem from "../models/OrderItem";
import Category from "../models/Category";
import { subHours } from "date-fns";

class OrderController {
  async store(request, response) {
    const schema = Yup.object().shape({
      products: Yup.array()
        .of(
          Yup.object().shape({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          })
        )
        .required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { userId } = request; // Supondo que você tenha userId disponível
    const { products, description } = request.body;

    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return response.status(404).json({ error: 'Usuário não encontrado' });
      }

      const order = await Order.create(
        {
          user_id: userId,
          status: "Pedido realizado",
          description: description, // Adicione o campo description com o valor desejado
          products: products.map((productInfo) => ({
            product_id: productInfo.id,
            quantity: productInfo.quantity,
          })),
          createdAt: subHours(new Date(), 3),
        },
        {
          include: [{ model: OrderItem, as: "products" }],
        }
      );

      return response.json(order);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Falha ao criar ordem' });
    }
  }

  async index(request, response) {
    try {
      const orders = await Order.findAll({
        where: { user_id: request.userId },
        include: [
          {
            model: OrderItem,
            as: "products",
            include: [
              {
                model: Product,
                as: "product",
                attributes: ["id", "name", "price", "path"],
                include: [
                  {
                    model: Category,
                    as: "category",
                    attributes: ["id", "name"],
                  },
                ],
              },
            ],
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email"],
          },
        ],
      });

      const formattedOrders = orders.map((order) => {
        const formattedProducts = order.products.map((product) => {
          return {
            quantity: product.quantity,
            name: product.product.name,
            price: product.product.price,
            category: product.product.category.name,
            url: product.product.url,
          };
        });

        return {
          _id: order.id,
          user: {
            id: order.user.id,
            name: order.user.name,
            email: order.user.email,
          },
          products: formattedProducts,
          status: order.status,
          description: order.description, // Incluída a descrição da ordem
          createdAt: order.createdAt,
        };
      });

      return response.json(formattedOrders);
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ error: 'Falha ao buscar pedidos' });
    }
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      status: Yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { userId } = request;
    
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return response.status(404).json({ error: 'Usuário não encontrado' });
      }

      if (!user.admin) {
        return response.status(401).json({ error: 'Você não está autorizado a executar esta ação' });
      }

      const { id } = request.params;
      const { status } = request.body;

      const order = await Order.findByPk(id);

      if (!order) {
        return response.status(404).json({ error: 'Ordem não encontrada' });
      }

      order.status = status;
      await order.save();

      return response.json({ message: 'Status atualizado com êxito', order });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Falha ao atualizar a ordem' });
    }
  }
}

export default new OrderController();
