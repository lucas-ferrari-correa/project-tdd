import { Property } from '../../../domain/entities/property';
import { PropertyEntity } from '../entities/property_entity';
import { PropertyMapper } from './property_mapper';

describe('PropertyMapper', () => {
  it('deve converter PropertyEntity em Property corretamente', () => {
    const propertyEntity: PropertyEntity = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Casa de Praia',
      description: 'Uma bela casa de praia com vista para o mar',
      maxGuests: 4,
      basePricePerNight: 200.0,
      bookings: [],
    };

    const property = PropertyMapper.toDomain(propertyEntity);

    expect(property).toBeInstanceOf(Property);
    expect(property.getId()).toBe(propertyEntity.id);
    expect(property.getName()).toBe(propertyEntity.name);
    expect(property.getDescription()).toBe(propertyEntity.description);
    expect(property.getMaxGuests()).toBe(propertyEntity.maxGuests);
    expect(property.getBasePricePerNight()).toBe(propertyEntity.basePricePerNight);
    expect(property.getBookings()).toEqual([]);
  });

  it('deve lançar erro de validação ao faltar campos obrigatórios no PropertyEntity', () => {
    const invalidPropertyEntity: Partial<PropertyEntity> = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      description: 'Uma bela casa de praia com vista para o mar',
      name: 'Propriedade',
      maxGuests: 0,
      basePricePerNight: 200.0,
      bookings: [],
    };

    expect(() => PropertyMapper.toDomain(invalidPropertyEntity as PropertyEntity)).toThrow(
      'O número máximo de hóspedes deve ser maior do que zero'
    );

    const invalidPropertyEntityNoName: Partial<PropertyEntity> = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: '',
      description: 'Uma bela casa de praia com vista para o mar',
      maxGuests: 4,
      basePricePerNight: 200.0,
      bookings: [],
    };

    expect(() => PropertyMapper.toDomain(invalidPropertyEntityNoName as PropertyEntity)).toThrow(
      'O nome é obrigatório'
    );
  })

  it('deve converter Property para PropertyEntity corretamente', () => {
    const property = new Property(
      '123e4567-e89b-12d3-a456-426614174000',
      'Casa de Praia',
      'Uma bela casa de praia com vista para o mar',
      4,
      200.0,
    );

    const propertyEntity = PropertyMapper.toPersistence(property);

    expect(propertyEntity).toBeInstanceOf(PropertyEntity);
    expect(propertyEntity.id).toBe(property.getId());
    expect(propertyEntity.name).toBe(property.getName());
    expect(propertyEntity.description).toBe(property.getDescription());
    expect(propertyEntity.maxGuests).toBe(property.getMaxGuests());
    expect(propertyEntity.basePricePerNight).toBe(property.getBasePricePerNight());
  });
})