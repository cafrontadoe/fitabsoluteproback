import { ConfigModule, EventBusService, CartService, OrderService } from "@medusajs/medusa";

type InjectedDependencies = {
  eventBusService: EventBusService;
  configModule: ConfigModule;
  cartService: CartService;
  orderService: OrderService;
};

class OrderPlacedSubscriber {
    cartService: any;
    orderService: any;
    orderRepository: any;
    constructor({ eventBusService, cartService, orderService, orderRepository }) {
        this.cartService = cartService
        this.orderService = orderService
        this.orderRepository = orderRepository

        eventBusService.subscribe("order.placed", this.handleOrderPlaced, { subscriberId: "order-capture-fulfill" })
    }

    handleOrderPlaced = async (data) => {
        const order = await this.orderService.retrieve(data.id, { relations: ["items"] })

        // auto-capture payment
        console.log('-------------------------------------------------------------------zzzzzzzzzzzz');
        console.log('order.payment_status:'+order.payment_status);
        if (order.payment_status !== "captured") {
            console.log('-------------------------------------------------------------------entra sok');
            await new Promise(resolve => setTimeout(resolve, 500));  // 1 second delay
           const result =  await this.orderService.capturePayment(order.id);

           console.log('resullt: '+result);
        }
  };
}

export default OrderPlacedSubscriber;