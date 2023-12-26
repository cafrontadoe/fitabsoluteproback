import { AbstractNotificationService } from "@medusajs/medusa"
import { EntityManager } from "typeorm"

class EmailSenderService extends AbstractNotificationService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager

  sendNotification(
    event: string, 
    data: unknown, 
    attachmentGenerator: unknown
  ): Promise<{ 
      to: string; 
      status: string; 
      data: Record<string, unknown>; 
    }> {
    throw new Error("Method not implemented.")
  }
  resendNotification(
    notification: unknown,
    config: unknown,
    attachmentGenerator: unknown
  ): Promise<{
      to: string; 
      status: string; 
      data: Record<string, unknown>; 
    }> {
    throw new Error("Method not implemented.")
  }

}

export default EmailSenderService