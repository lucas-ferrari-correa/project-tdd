import { Booking } from "../../../domain/entities/booking";
import { BookingEntity } from "../../persistence/entities/booking_entity";
import { BookingMapper } from "./booking_mapper";
import { DateRange } from "../../../domain/value-objects/date_range";
import { Property } from "../../../domain/entities/property";
import { User } from "../../../domain/entities/user";
import { PropertyEntity } from "../../persistence/entities/property_entity";
import { UserEntity } from "../../persistence/entities/user_entity";

describe("BookingMapper", () => {
  let mockProperty: Property;
  let mockUser: User;
  let mockDateRange: DateRange;
  let mockPropertyEntity: PropertyEntity;
  let mockUserEntity: UserEntity;

  beforeEach(() => {
    mockProperty = {
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(1000),
      addBooking: jest.fn(),
      getId: jest.fn().mockReturnValue("property-1"),
      getName: jest.fn().mockReturnValue("Casa de Praia"),
      getDescription: jest.fn().mockReturnValue("Uma bela casa na praia"),
      getMaxGuests: jest.fn().mockReturnValue(4),
      getBasePricePerNight: jest.fn().mockReturnValue(200),
    } as unknown as Property;

    mockUser = new User("user-1", "João Silva");

    mockDateRange = new DateRange(new Date("2025-08-01"), new Date("2025-08-05"));

    mockPropertyEntity = {
      id: "property-1",
      name: "Casa de Praia",
      description: "Uma bela casa na praia",
      maxGuests: 4,
      basePricePerNight: 200,
      bookings: [],
    } as PropertyEntity;

    mockUserEntity = {
      id: "user-1",
      name: "João Silva",
    } as UserEntity;
  })

  it("deve converter BookingEntity em Booking corretamente", () => {
    const bookingEntity: BookingEntity = {
      id: "booking-1",
      property: mockPropertyEntity,
      guest: mockUserEntity,
      startDate: new Date("2025-08-01"),
      endDate: new Date("2025-08-05"),
      guestCount: 2,
      totalPrice: 1000,
      status: "CONFIRMED",
    };

    const booking = BookingMapper.toDomain(bookingEntity);

    expect(booking.getId()).toBe("booking-1");
    expect(booking.getProperty().getId()).toBe("property-1");
    expect(booking.getProperty().getName()).toBe("Casa de Praia");
    expect(booking.getGuest().getId()).toBe("user-1");
    expect(booking.getGuest().getName()).toBe("João Silva");
    expect(booking.getDateRange().getStartDate()).toEqual(new Date("2025-08-01"));
    expect(booking.getDateRange().getEndDate()).toEqual(new Date("2025-08-05"));
    expect(booking.getGuestCount()).toBe(2);
    expect(booking.getTotalPrice()).toBe(1000);
    expect(booking.getStatus()).toBe("CONFIRMED");
  });

  it("deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", () => {
    const invalidBookingEntity1: Partial<BookingEntity> = {
      id: "booking-1",
      guest: mockUserEntity,
      startDate: new Date("2025-08-01"),
      endDate: new Date("2025-08-05"),
      guestCount: 2,
      totalPrice: 1000,
      status: "CONFIRMED",
    };

    const invalidBookingEntity2: Partial<BookingEntity> = {
      id: "booking-1",
      property: mockPropertyEntity,
      startDate: new Date("2025-08-01"),
      endDate: new Date("2025-08-05"),
      guestCount: 2,
      totalPrice: 1000,
      status: "CONFIRMED",
    };

    const invalidBookingEntity3: Partial<BookingEntity> = {
      id: "booking-1",
      property: mockPropertyEntity,
      guest: mockUserEntity,
      endDate: new Date("2025-08-05"),
      guestCount: 2,
      totalPrice: 1000,
      status: "CONFIRMED",
    };

    const invalidBookingEntity4: Partial<BookingEntity> = {
      id: "booking-1",
      property: mockPropertyEntity,
      guest: mockUserEntity,
      startDate: new Date("2025-08-01"),
      guestCount: 2,
      totalPrice: 1000,
      status: "CONFIRMED",
    };

    expect(() => BookingMapper.toDomain(invalidBookingEntity1 as BookingEntity)).toThrow(
      "Propriedade é obrigatória"
    );
    expect(() => BookingMapper.toDomain(invalidBookingEntity2 as BookingEntity)).toThrow(
      "Hóspede é obrigatório"
    );
    expect(() => BookingMapper.toDomain(invalidBookingEntity3 as BookingEntity)).toThrow(
      "Data de início é obrigatória"
    );
    expect(() => BookingMapper.toDomain(invalidBookingEntity4 as BookingEntity)).toThrow(
      "Data de término é obrigatória"
    );
  });

  it("deve converter Booking para BookingEntity corretamente", () => {
    const booking = new Booking(
      "booking-1",
      mockProperty,
      mockUser,
      mockDateRange,
      2
    );

    const bookingEntity = BookingMapper.toPersistence(booking);

    expect(bookingEntity.id).toBe("booking-1");
    expect(bookingEntity.property.id).toBe("property-1");
    expect(bookingEntity.property.name).toBe("Casa de Praia");
    expect(bookingEntity.guest.id).toBe("user-1");
    expect(bookingEntity.guest.name).toBe("João Silva");
    expect(bookingEntity.startDate).toEqual(new Date("2025-08-01"));
    expect(bookingEntity.endDate).toEqual(new Date("2025-08-05"));
    expect(bookingEntity.guestCount).toBe(2);
    expect(bookingEntity.totalPrice).toBe(1000);
    expect(bookingEntity.status).toBe("CONFIRMED");
  });
})