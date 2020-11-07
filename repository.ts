import { CoreV1Api, V1Pod } from '@kubernetes/client-node';
import { Pod } from "./entities";

export interface PodRepository {
  findByName(name: string): Promise<Pod>;
}

export class K8sPodRepository implements PodRepository {
  namespace: string;
  api: CoreV1Api;

  constructor(data: {
    namespace: string
    api: CoreV1Api
  }) {
    this.namespace = data.namespace
    this.api = data.api
  }

  async findByName(name: string): Promise<Pod> {
    const res = await this.api.readNamespacedPod(name, this.namespace)
    const body: V1Pod = res.body
    return Pod.createFromK8sPod(body)
  }
} 
