import { RefundRule } from "./refund_rule";

export class FullRefund implements RefundRule {
  calculateRefund(totalPrice: number): number {
    return 0
  }
}