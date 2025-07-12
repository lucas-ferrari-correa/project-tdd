import { DateRange } from '../value-objects/date_range'
import { Booking } from './booking'

export class Property {
  private readonly id: string
  private readonly name: string
  private readonly description: string
  private readonly maxGuests: number
  private readonly basePricePerNight: number
  private readonly bookings: Booking[] = []

  constructor(
    id: string,
    name: string,
    description: string,
    maxGuests: number,
    basePricePerNight: number,
  ) {
    this.validateProperty(name, maxGuests)

    this.id = id;
    this.name = name;
    this.description = description;
    this.maxGuests = maxGuests;
    this.basePricePerNight = basePricePerNight;
  }

  private validateProperty(name: string, maxGuests: number) {
    if (!name?.length) {
      throw new Error('O nome é obrigatório')
    }

    if (maxGuests <= 0) {
      throw new Error('O número máximo de hóspedes deve ser maior do que zero')
    }
  }

  validateGuestCount(guestCount: number) {
    if (guestCount > this.maxGuests) {
      throw new Error('Número máximo de hóspedes excedido.')
    }
  }

  getId() {
    return this.id
  }

  getName() {
    return this.name
  }

  getDescription() {
    return this.description
  }

  getMaxGuests() {
    return this.maxGuests
  }

  getBasePricePerNight() {
    return this.basePricePerNight
  }

  calculateTotalPrice(dateRange: DateRange): number {
    const totalNights = dateRange.getTotalNights();
    let totalPrice = totalNights * this.basePricePerNight;

    if (totalNights >= 7) {
      totalPrice *= 0.9
    }

    return totalPrice
  }

  isAvailable(dateRange: DateRange): boolean {
    return !this.bookings.some((booking) => 
      booking.getStatus() === 'CONFIRMED' &&
      booking.getDateRange().overlaps(dateRange)
    )
  }

  addBooking(booking: Booking) {
    this.bookings.push(booking);
  }

  getBookings(): Booking[] {
    return [...this.bookings];
  }
}