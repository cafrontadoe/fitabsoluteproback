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
      let retries = 3;  // Number of retries you want
  
      while (retries > 0) {
          try {
              const order = await this.orderService.retrieve(data.id, { relations: ["items"] });
  
              // auto-capture payment
              console.log('-------------------------------------------------------------------zzzzzzzzzzzz');
              console.log('order.payment_status:'+order.payment_status);
              
              if (order.payment_status !== "captured") {
                  console.log('-------------------------------------------------------------------entra sok');
                 
                  const result = await this.orderService.capturePayment(order.id);
  
                  console.log('resullt: ' + result);
  
                  // Break the loop if successful
                  break;
              }
          } catch (error) {
              if (error.response && error.response.status === 409) {
                  // Handle 409 error (Conflict) - You may log it or do additional actions
                  console.error('Conflict error (409) - Retrying...');
                  
                  // Decrement the number of retries
                  retries--;
  
                  // You may add a delay between retries if needed
                  await new Promise(resolve => setTimeout(resolve, 1000));  // 1 second delay
              } else {
                  // Handle other errors
                  console.error('Unexpected error:', error);
                  break;  // Exit the loop on unexpected errors
              }
          }
      }
  };

  //   handleOrderPlaced = async (data) => {
  //       const order = await this.orderService.retrieve(data.id, { relations: ["items"] })

  //       // auto-capture payment
  //       console.log('-------------------------------------------------------------------zzzzzzzzzzzz');
  //       console.log('order.payment_status:'+order.payment_status);
  //       if (order.payment_status !== "captured") {
  //         await new Promise(resolve => setTimeout(resolve, 500));  // 1 second delay
  //         console.log('-------------------------------------------------------------------entra sok');
  //          const result =  await this.orderService.capturePayment(order.id);

  //          console.log('resullt: '+result);
  //       }
  // };
}

export default OrderPlacedSubscriber;
