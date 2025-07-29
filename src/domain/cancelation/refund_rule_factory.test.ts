import { FullRefund } from "./full_refund";
import { NoRefund } from "./no_refund";
import { PartialRefund } from "./partial_refund";
import { RefundRuleFactory } from "./refund_rule_factory";

describe("RefundRuleFactory", () => {
  it("deve retornar FullRefund quando a reserva for cancelada com mais de 7 dias de antecedência", () => {
    const refundRule = RefundRuleFactory.getRefundRule(8);
    
    expect(refundRule).toBeInstanceOf(FullRefund);
    expect(refundRule.calculateRefund(100)).toBe(0);
  });

  it("deve retornar PartialRefund quando a reserva for cancelada entre 1 e 7 dias de antecedência", () => {
    const refundRule1 = RefundRuleFactory.getRefundRule(1);
    const refundRule7 = RefundRuleFactory.getRefundRule(7);
    
    expect(refundRule1).toBeInstanceOf(PartialRefund);
    expect(refundRule1.calculateRefund(100)).toBe(50);
    
    expect(refundRule7).toBeInstanceOf(PartialRefund);
    expect(refundRule7.calculateRefund(100)).toBe(50);
  });

  it("deve retornar NoRefund quando a reserva for cancelada com menos de 1 dia de antecedência", () => {
    const refundRule = RefundRuleFactory.getRefundRule(0);

    expect(refundRule).toBeInstanceOf(NoRefund);
    expect(refundRule.calculateRefund(100)).toBe(100);
  });
});