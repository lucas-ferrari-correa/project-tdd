import { PropertyService } from './property_service'
import { Property } from '../../domain/entities/property';
import { FakePropertyRepository } from '../../infrastructure/repositories/fake_property_repository'

describe('PropertyService', () => {
  let propertyService: PropertyService
  let fakePropertyRepository: FakePropertyRepository;

  beforeEach(() => {
    fakePropertyRepository = new FakePropertyRepository();
    propertyService = new PropertyService(fakePropertyRepository)
  })

  it('deve retornar null quando um ID inválido for passado', async () => {
    const property = await propertyService.findByPropertyId('999')
    expect(property).toBeNull()
  })

  it('deve salvar uma nova propriedade com sucesso usando repositorio fake e buscar novamente', async () => {
    const newProperty = new Property(
      '3',
      'Test Property',
      'Test Description',
      4,
      100
    )
    await fakePropertyRepository.save(newProperty)

    const property = await propertyService.findByPropertyId('3')
    expect(property).not.toBeNull()
    expect(property?.getId()).toBe('3')
    expect(property?.getName()).toBe('Test Property')
  })
})