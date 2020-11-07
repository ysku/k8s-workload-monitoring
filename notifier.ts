export interface Notifier {
  notify(payload: any): Promise<void>
}

export class StdoutNotifier {
  async notify(payload: any) {
    console.log('notifying:', payload)
  }
}
