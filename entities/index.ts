import { V1Pod } from '@kubernetes/client-node';

export class Pod {
  name: string
  phase: string | undefined
  createdAt: Date | undefined
  
  constructor(data: {
    name: string | undefined
    phase: string | undefined
    createdAt: Date | undefined
  }) {
    if (!data.name) {
      throw new Error('name is not set')
    }
    this.name = data.name
    this.phase = data.phase
    this.createdAt = data.createdAt
  }
  
  static createFromK8sPod(k8sPod: V1Pod): Pod {
    return new Pod({
      name: k8sPod.metadata.name,
      phase: k8sPod.status?.phase,
      createdAt: k8sPod.metadata?.creationTimestamp
    })
  }
}
