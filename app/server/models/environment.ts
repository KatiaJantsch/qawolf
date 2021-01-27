import { db } from "../db";
import { ClientError } from "../errors";
import { Environment, ModelOptions } from "../types";
import { cuid } from "../utils";

type CreateEnvironment = {
  name: string;
  team_id: string;
};

type UpdateEnvironment = {
  id: string;
  name: string;
};

export const createEnvironment = async (
  { name, team_id }: CreateEnvironment,
  { logger, trx }: ModelOptions
): Promise<Environment> => {
  const log = logger.prefix("createEnvironment");

  if (!name) {
    log.error("name not provided");
    throw new Error("Must provide name");
  }

  const environment = {
    id: cuid(),
    name,
    team_id,
  };

  try {
    await (trx || db)("environments").insert(environment);
  } catch (error) {
    if (error.message.includes("environments_name_team_id_unique")) {
      throw new ClientError("environment name must be unique");
    }

    throw error;
  }

  log.debug("created", environment.id);

  return environment;
};

export const findEnvrionment = async (
  id: string,
  { logger, trx }: ModelOptions
): Promise<Environment> => {
  const log = logger.prefix("findEnvironment");

  const environment = await (trx || db)("environments")
    .select("*")
    .where({ id })
    .first();

  if (!environment) {
    log.error("not found", id);
    throw new Error("Environment not found");
  }

  return environment;
};

export const findEnvironmentsForTeam = async (
  team_id: string,
  { logger, trx }: ModelOptions
): Promise<Environment[]> => {
  const log = logger.prefix("findEnvironmentsForTeam");

  const environments = await (trx || db)("environments")
    .where({ team_id })
    .orderBy("name", "asc");

  log.debug(`found ${environments.length} environments`);

  return environments;
};

export const updateEnvironment = async (
  { id, name }: UpdateEnvironment,
  { logger, trx }: ModelOptions
): Promise<Environment> => {
  const log = logger.prefix("updateEnvironment");

  if (!name) {
    log.error("name not provided", id);
    throw new Error("Must provide name");
  }

  const existingEnvironment = await findEnvrionment(id, { logger, trx });

  const updates = { name, updated_at: new Date().toISOString() };

  try {
    await (trx || db)("environments").where({ id }).update(updates);
  } catch (error) {
    if (error.message.includes("environments_name_team_id_unique")) {
      throw new ClientError("environment name must be unique");
    }

    throw error;
  }

  log.debug("updated environment", id, updates);

  return { ...existingEnvironment, ...updates };
};
