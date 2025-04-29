import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import { LogRepository } from "../../domain/repository/log.repository";
import { LogDatasource } from "../../domain/datasources/log.datasource";

export class LogRepositoryImpl implements LogRepository {
  constructor(
    private readonly LogDatasource: LogDatasource // Esto se crea para la posibilidad de poder cambiar facilmente.
  ) {}

  async saveLog(log: LogEntity): Promise<void> {
    return this.LogDatasource.saveLog(log);
  }
  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    return this.LogDatasource.getLogs(severityLevel);
  }
}
