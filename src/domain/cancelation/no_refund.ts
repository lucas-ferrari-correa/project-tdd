import { RefundRule } from "./refund_rule";

export class NoRefund implements RefundRule {
  calculateRefund(totalPrice: number): number {
    return totalPrice
  }
}