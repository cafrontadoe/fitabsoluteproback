import { 
    type SubscriberConfig, 
    type SubscriberArgs,
    OrderService,
  } from "@medusajs/medusa"
  
  export default async function handleOrderPlaced({ 
    data, eventName, container, pluginOptions, 
  }: SubscriberArgs<Record<string, string>>) {
    const sendGridService = container.resolve("sendgridService")
    const orderService: OrderService = container.resolve(
      "orderService"
    )
  
    const order = await orderService.retrieve(data.id, {
      // you can include other relations as well
      relations: ["items"],
    })

     // auto-capture payment
     if (order.payment_status !== "captured") {
        await orderService.capturePayment(order.id);
    }
  
    
  }
  
  export const config: SubscriberConfig = {
    event: OrderService.Events.PLACED,
    context: {
      subscriberId: "order-placed-handler",
    },
  }