import { PodWorker } from "./worker"

export class PodWorkerGroup {
  workers: Record<string, PodWorker>

  constructor(workers: Record<string, PodWorker> = {}) {
    this.workers = workers
  }

  async add(worker: PodWorker) {
    const podName = worker.getName()
    if (podName in this.workers) {
      throw new Error(`pod (name: ${podName}) already exists`)
    }
    this.workers[podName] = worker
    worker.start()
    console.log(`pod (name: ${podName}) added`)
  }

  get(podName: string): PodWorker {
    if (podName in this.workers) {
      return this.workers[podName]
    } else {
      throw new Error(`pod (name: ${podName}) not found`)
    }
  }

  delete(podName: string) {
    const podWorker = this.get(podName)
    delete this.workers[podName]
    podWorker.stop()
    console.log(`pod (name: ${podName}) deleted`)
  }
}
