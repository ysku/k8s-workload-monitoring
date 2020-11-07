import * as k8s from '@kubernetes/client-node';
import { Pod } from "./entities";
import { StdoutNotifier } from "./notifier";
import { K8sPodRepository } from "./repository";
import { PodMonWorker } from "./worker";
import { PodWorkerGroup } from "./workerGroup";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

(async () => {
  const notifier = new StdoutNotifier()
  const podRepository = new K8sPodRepository({
    namespace: 'default',
    api: k8sApi
  })
  const workerGroup = new PodWorkerGroup()

  const informer = k8s.makeInformer(kc, '/api/v1/namespaces/default/pods', () => k8sApi.listNamespacedPod('default'));

  informer.on('add', (obj: k8s.V1Pod) => { 
    const pod = Pod.createFromK8sPod(obj)
    if (!pod.phase || pod.phase === "Pending") {
      const worker = new PodMonWorker({
        podName: pod.name,
        podRepository,
        notifier
      })
      workerGroup.add(worker)  
    }
  });
  informer.on('update', (obj: k8s.V1Pod) => { 
    const pod = Pod.createFromK8sPod(obj)
    if (pod.phase === "Running") {
      // no need to watch anymore
      workerGroup.delete(pod.name)
    }
  });
  informer.on('delete', (obj: k8s.V1Pod) => {
    const pod = Pod.createFromK8sPod(obj)
    workerGroup.delete(pod.name)
  });
  informer.on('error', (err: k8s.V1Pod) => {
    console.error(err);
    // Restart informer after 5sec
    setTimeout(() => {
      informer.start();
    }, 5000);
  });

  informer.start();
})()
