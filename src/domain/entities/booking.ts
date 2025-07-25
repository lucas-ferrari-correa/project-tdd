import { RefundRuleFactory } from "../cancelation/refund_rule_factory";
import { DateRange } from "../value-objects/date_range";
import { Property } from "./property";
import { User } from "./user";

export class Booking {
  private readonly id: string
  private readonly property: Property
  private readonly guest: User
  private readonly dateRange: DateRange
  private readonly guestCount: number
  private status: 'CONFIRMED' | 'CANCELLED' = 'CONFIRMED'
  private totalPrice: number
  
  constructor(
    id: string,
    property: Property,
    guest: User,
    dateRange: DateRange,
    guestCount: number
  ) {
    if (guestCount <= 0) {
      throw new Error('O número de hóspedes deve ser maior do que zero')
    }

    property.validateGuestCount(guestCount)

    if (!property.isAvailable(dateRange)) {
      throw new Error('A propriedade não está disponível para o período selecionado')
    }

    this.id = id;
    this.property = property;
    this.guest = guest;
    this.dateRange = dateRange;
    this.guestCount = guestCount;

    this.totalPrice = property.calculateTotalPrice(dateRange)

    property.addBooking(this);
  }

  getId(): string {
    return this.id
  }

  getProperty(): Property {
    return this.property
  }

  getUser(): User {
    return this.guest
  }

  getDateRange(): DateRange {
    return this.dateRange
  }

  getGuest(): User {
    return this.guest
  }

  getGuestCount(): number {
    return this.guestCount
  }

  getStatus(): 'CONFIRMED' | 'CANCELLED' {
    return this.status
  }

  getTotalPrice(): number {
    return this.totalPrice;
  }

  cancel(currentDate: Date): void {
    if (this.status === 'CANCELLED') {
      throw new Error('A reserva já está cancelada.')
    }

    
    const checkInDate = this.dateRange.getStartDate();
    const timeDiff = checkInDate.getTime() - currentDate.getTime();
    const daysUntilCheckIn = Math.ceil(timeDiff / (1000 * 3600 * 24))
    
    const refundRule = RefundRuleFactory.getRefundRule(daysUntilCheckIn)
    this.totalPrice = refundRule.calculateRefund(this.totalPrice)
    this.status = 'CANCELLED'
  }
}