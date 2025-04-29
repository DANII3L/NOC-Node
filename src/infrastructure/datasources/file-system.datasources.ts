import { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import * as fs from "fs";

export class FileSystemDatasource implements LogDatasource {
  private readonly logPath = "logs/";
  private readonly allLogsPath = "logs/logs-all.log";
  private readonly mediumLogsPath = "logs/logs-medium.log";
  private readonly highLogsPath = "logs/logs-high.log";

  constructor() {
    this.createLogsGiles();
  }

  private createLogsGiles = () => {
    if (!fs.existsSync(this.logPath)) fs.mkdirSync(this.logPath);

    [this.allLogsPath, this.mediumLogsPath, this.highLogsPath].forEach(
      (path) => {
        if (fs.existsSync(path)) return;
        fs.writeFileSync(path, "");
      }
    );
  };

  async saveLog(newlog: LogEntity): Promise<void> {
    const messageFile = `${JSON.stringify(newlog)} \n`;
    fs.appendFileSync(this.allLogsPath, messageFile);
    if (newlog.level === LogSeverityLevel.low) return;
    if (newlog.level === LogSeverityLevel.medium)
      fs.appendFileSync(this.mediumLogsPath, messageFile);
    else fs.appendFileSync(this.highLogsPath, messageFile);
  }

  private getLogFromFile = (path: string): LogEntity[] => {
    const content = fs.readFileSync(path, "utf-8");
    const logs = content.split("\n").map(LogEntity.fromJson);
    return logs;
  };

  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    switch (severityLevel) {
      case LogSeverityLevel.low:
        return this.getLogFromFile(this.allLogsPath);
      case LogSeverityLevel.medium:
        return this.getLogFromFile(this.mediumLogsPath);
      case LogSeverityLevel.high:
        return this.getLogFromFile(this.highLogsPath);

      default:
        throw new Error(`${severityLevel} not implemented.`);
    }
  }
}
