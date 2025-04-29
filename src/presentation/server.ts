import { CheckService } from "../domain/use-cases/checks/check-service";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasources";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";

const fileSystemLogRespository = new LogRepositoryImpl(
  new FileSystemDatasource(),
  //new PostgressSQL, //---> Cambio de repositorios facilmente
);

export class Server {
  static start() {
    console.log("Server started...");
    const url: string = "http://localhost:3000";
    CronService.CreateJob("*/5 * * * * *", () => {
      new CheckService(
        fileSystemLogRespository,
        () => console.log(`${url} is ok.`),
        (error) => console.error(error)
      ).execute(url);
    });
  }
}
