import { Notifier } from "./notifier";
import { PodRepository } from "./repository";

export interface PodWorker {
  getName(): string
  start(): void
  stop(): void
  restart(): void
}

export class PodMonWorker implements PodWorker {
  podName: string
  podRepository: PodRepository
  notifier: Notifier
  startedAt: Date | undefined
  timer: NodeJS.Timeout | undefined
  watchIntervalSeconds: number = 5
  // initialDelaySeconds: number = 5 * 60  // 5 minutes
  initialDelaySeconds: number = 5 * 60 * 60 * 60  // 5 minutes

  constructor(data: {
    podName: string
    podRepository: PodRepository
    notifier: Notifier
  }) {
    this.podName = data.podName
    this.podRepository = data.podRepository
    this.notifier = data.notifier
  }

  getName(): string {
    return this.podName
  }

  async start() {
    this.startedAt = new Date()
    await this.run()
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  restart() {
    this.stop()
    this.start()
  }

  private async run() {
    this.timer = setInterval(async () => {
      console.log("running...", this.podName)
      const pod = await this.podRepository.findByName(this.podName)
      if (!pod.createdAt) {
        return
      }
      if (!pod.phase) {
        return
      }
      if (pod.phase === "Pending" && (Date.now() - pod.createdAt.getTime()) > this.initialDelaySeconds * 1000) {
        await this.notifier.notify("this pod is pending for a long time")
        this.stop()
      }
      if (pod.phase === "Running") {
        // no need to watch anymore
        this.stop()
      }
    }, this.watchIntervalSeconds * 1000)
  }
}
