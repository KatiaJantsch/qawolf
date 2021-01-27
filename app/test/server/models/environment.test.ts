import { db, dropTestDb, migrateDb } from "../../../server/db";
import {
  findEnvironmentsForTeam,
  findEnvrionment,
  updateEnvironment,
} from "../../../server/models/environment";
import { Environment } from "../../../server/types";
import { buildEnvironment, buildTeam, logger } from "../utils";

beforeAll(async () => {
  await migrateDb();

  return db("teams").insert([buildTeam({}), buildTeam({ i: 2 })]);
});

afterAll(() => dropTestDb());

describe("findEnvironment", () => {
  beforeAll(() => {
    return db("environments").insert(buildEnvironment({}));
  });

  afterAll(() => db("environments").del());

  it("finds an environment", async () => {
    const environment = await findEnvrionment("environmentId", { logger });

    expect(environment).toMatchObject({ name: "Staging", team_id: "teamId" });
  });

  it("throws an error if environment not found", async () => {
    const testFn = async (): Promise<Environment> => {
      return findEnvrionment("fakeId", { logger });
    };

    await expect(testFn()).rejects.toThrowError("not found");
  });
});

describe("findEnvironmentsForTeam", () => {
  beforeAll(() => {
    return db("environments").insert([
      buildEnvironment({}),
      buildEnvironment({ i: 2, name: "Production" }),
      buildEnvironment({ i: 3, name: "Other", team_id: "team2Id" }),
    ]);
  });

  afterAll(() => db("environments").del());

  it("finds environments for a team", async () => {
    const environments = await findEnvironmentsForTeam("teamId", { logger });

    expect(environments).toMatchObject([
      { name: "Production" },
      { name: "Staging" },
    ]);
  });
});

describe("updateEnvironment", () => {
  beforeAll(() => {
    return db("environments").insert(buildEnvironment({}));
  });

  afterAll(() => db("environments").del());

  it("updates an environment", async () => {
    const environment = await updateEnvironment(
      { id: "environmentId", name: "New Name" },
      { logger }
    );

    const dbEnvironment = await db("environments").select("*").first();

    expect(environment.name).toBe("New Name");
    expect(dbEnvironment.name).toBe("New Name");
  });

  it("throws an error if name not provided", async () => {
    const testFn = async (): Promise<Environment> => {
      return updateEnvironment({ id: "environmentId", name: "" }, { logger });
    };

    await expect(testFn()).rejects.toThrowError("Must provide name");
  });
});
