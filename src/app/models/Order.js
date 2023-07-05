// models/Order.js
import Sequelize, { Model } from 'sequelize';
import User from './User';
import OrderItem from './OrderItem';

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        status: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Order',
        tableName: 'orders',
        underscored: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    this.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'products',
    });
  }

  // Adicione um getter virtual para a URL da imagem do produto
  get url() {
    // Certifique-se de substituir "this.path" pelo nome correto do atributo de imagem do seu modelo Product
    return `http://localhost:3000/product-file/${this.products[0]?.product.path}`;
  }
}

export default Order;
