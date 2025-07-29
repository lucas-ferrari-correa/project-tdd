import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";

import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import { PropertyService } from "../../application/services/property_service";
import { PropertyController } from './property_controller'
import { PropertyEntity } from "../persistence/entities/property_entity";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { UserEntity } from "../persistence/entities/user_entity";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let propertyRepository: TypeORMPropertyRepository;
let propertyService: PropertyService;
let propertyController: PropertyController;

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [PropertyEntity, BookingEntity, UserEntity],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();

  propertyRepository = new TypeORMPropertyRepository(
    dataSource.getRepository(PropertyEntity)
  );
  propertyService = new PropertyService(propertyRepository);
  propertyController = new PropertyController(propertyService);

  app.post("/properties", (req, res, next) => {
    propertyController.createProperty(req, res).catch((err) => next(err));
  });
})

afterAll(async () => {
  await dataSource.destroy();
});

describe("PropertyController", () => {
  beforeEach(async () => {
    const propertyRepo = dataSource.getRepository(PropertyEntity);
    await propertyRepo.clear();
  });

  it("deve criar uma propriedade com sucesso", async () => {
    const response = await request(app).post("/properties").send({
      name: "Propriedade de Teste",
      description: "Um lugar incrível para ficar",
      maxGuests: 5,
      basePricePerNight: 100,
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Property created successfully");
    expect(response.body.property).toHaveProperty("id");
    expect(response.body.property.name).toBe("Propriedade de Teste");
    expect(response.body.property.description).toBe("Um lugar incrível para ficar");
    expect(response.body.property.maxGuests).toBe(5);
    expect(response.body.property.basePricePerNight).toBe(100);
  });

  it("deve retornar erro com código 400 e mensagem 'O nome é obrigatório' ao enviar um nome vazio", async () => {
    const response = await request(app).post("/properties").send({
      name: "",
      description: "Um lugar incrível para ficar",
      maxGuests: 5,
      basePricePerNight: 100,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("O nome é obrigatório");
  });

  it("deve retornar erro com código 400 e mensagem 'O número máximo de hóspedes deve ser maior do que zero' ao enviar maxGuests igual a zero ou negativo", async () => {
    const responseZero = await request(app).post("/properties").send({
      name: "Propriedade de Teste",
      description: "Um lugar incrível para ficar",
      maxGuests: 0,
      basePricePerNight: 100,
    });

    expect(responseZero.status).toBe(400);
    expect(responseZero.body.message).toBe("O número máximo de hóspedes deve ser maior do que zero");

    const responseNegative = await request(app).post("/properties").send({
      name: "Propriedade de Teste",
      description: "Um lugar incrível para ficar",
      maxGuests: -1,
      basePricePerNight: 100,
    });

    expect(responseNegative.status).toBe(400);
    expect(responseNegative.body.message).toBe("O número máximo de hóspedes deve ser maior do que zero");
  });

  it("deve retornar erro com código 400 e mensagem 'O preço base por noite é obrigatório.' ao enviar basePricePerNight ausente", async () => {
    const response = await request(app).post("/properties").send({
      name: "Propriedade de Teste",
      description: "Um lugar incrível para ficar",
      maxGuests: 5,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("O preço base por noite é obrigatório");
  });
})