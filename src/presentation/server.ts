import { CheckService } from "../domain/use-cases/checks/check-service";
import { CronService } from "./cron/cron-service";

export class Server {
  static start() {
    console.log("Server started...");
    const url: string = "http://localhost:3000";
    CronService.CreateJob("*/5 * * * * *", () => {
      new CheckService(
        () => console.log(`${url} is ok.`),
        (error) => console.error(error)
      ).execute(url);
    });
  }
}
