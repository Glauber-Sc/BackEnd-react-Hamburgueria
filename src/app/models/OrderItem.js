// models/OrderItem.js
import Sequelize, { Model } from 'sequelize';

class OrderItem extends Model {
  static init(sequelize) {
    super.init(
      {
        quantity: Sequelize.INTEGER,
        
      },
      {
        sequelize,
        modelName: 'OrderItem',
        tableName: 'order_items',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order',
    });

    this.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product',
    });
  }

  // Adicione um getter virtual para a URL da imagem do produto
  get url() {
    // Certifique-se de substituir "this.path" pelo nome correto do atributo de imagem do seu modelo Product
    return `http://localhost:3000/product-file/${this.product.path}`;
  }
}

export default OrderItem;

