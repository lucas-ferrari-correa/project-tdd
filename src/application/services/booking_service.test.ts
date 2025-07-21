import { Booking } from "../../domain/entities/booking";
import { CreateBookingDTO } from "../../application/dtos/create_booking_dto";

describe('BookingService', () => {
  it('deve criar uma reserva com sucess usando repositório fake', async () => {
    // const mockProperty = {
    //   getId: jest.fn().mockReturnValue("1"),
    //   isAvailable: jest.fn().mockReturnValue(true),
    //   validateGuestCount: jest.fn(),
    //   calculateTotalPrice: jest.fn().mockReturnValue(500),
    //   addBooking: jest.fn(),
    // } as any;

    // const mockUser = {
    //   getId: jest.fn().mockReturnValue("1"),
    // } as any;

    // mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    // mockUserService.findUserById.mockResolvedValue(mockUser);

    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2024-12-20"),
      endDate: new Date("2024-12-25"),
      guestCount: 2,
    };

    const result = await bookingService.createBooking(bookingDTO);

    expect(result).toBeInstanceOf(Booking);
    expect(result.getStatus()).toBe("CONFIRMED");
    expect(result.getTotalPrice()).toBe(500);

    const savedBooking = await fakeBookingRepository.findById(result.getId());
    expect(savedBooking).not.toBeNull();
    expect(savedBooking?.getId()).toBe(result.getId());
  })
})