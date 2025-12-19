const kv = await Deno.openKv();

export function kvStoreForTeam(teamId: string): KvStore {
  return new DenoKvStore({
    namespace: ["team", teamId],
  });
}

// IKvStore interface: KvStoreのpublicメソッドを型定義
export interface KvStore<T = unknown> {
  readonly namespace: string[];
  child<U>(...namespace: string[]): KvStore<U>;
  get(): Promise<T | undefined>;
  list(): Promise<Record<string, T>>;
  set(obj: Partial<T>): Promise<void>;
  create(obj: T | Partial<T>): Promise<boolean>;
  delelte(): Promise<void>;
  update(fn: (value: T) => T): Promise<unknown>;
  listUpdate(
    fn: (values: Record<string, T>) => Record<string, T | undefined>,
  ): Promise<unknown>;
}

class DenoKvStore<T = unknown> implements KvStore<T> {
  readonly namespace: string[];

  constructor(args: { namespace: string[] }) {
    this.namespace = args.namespace;
  }
  child<U>(...namespace: string[]): KvStore<U> {
    return new DenoKvStore<U>({
      namespace: this.namespace.concat(namespace),
    });
  }

  async get(): Promise<T | undefined> {
    const data = await kv.get<T>(this.namespace);
    return data.value || undefined;
  }

  async list(): Promise<Record<string, T>> {
    const entries = await kv.list<T>({ prefix: this.namespace });
    const result: Record<string, T> = {};
    for await (const entry of entries) {
      result[entry.key.slice(this.namespace.length).join("/")] = entry.value;
    }
    return result;
  }

  async set(obj: Partial<T>) {
    await kv.set(this.namespace, obj);
  }

  async create(obj: T | Partial<T>): Promise<boolean> {
    const result = await kv.atomic().check({
      key: this.namespace,
      versionstamp: null,
    }).set(this.namespace, obj).commit();
    return result.ok;
  }

  async delelte() {
    await kv.delete(this.namespace);
  }

  async update(fn: (value: T) => T) {
    const data = await kv.get<T>(this.namespace);
    const newValue = fn(data.value!);
    return kv.atomic().check(data).set(this.namespace, newValue).commit();
  }

  async listUpdate(
    fn: (values: Record<string, T>) => Record<string, T | undefined>,
  ) {
    const entries = await kv.list<T>({ prefix: this.namespace });
    const values: Record<string, T> = {};
    for await (const entry of entries) {
      values[entry.key.slice(this.namespace.length).join("/")] = entry.value;
    }
    const newValues = fn(values);
    const batch = kv.atomic();
    for (const key in newValues) {
      const fullKey = this.namespace.concat(key.split("/"));
      const newValue = newValues[key];
      if (newValue === undefined) {
        batch.delete(fullKey);
      } else {
        console.log("Updating", fullKey);
        batch.set(fullKey, newValue);
      }
    }
    return batch.commit();
  }
}
