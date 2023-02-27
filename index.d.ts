export declare class QueryTable {
  constructor(datapath: string);

  count(): Promise<number>;

  find<T extends Object>(uniq: string): Promise<T | undefined>;

  /**
   * @param datapath 
   * @param offset default is 0
   * @param limit default is -1, means no limit
   */
  select<T extends Object>(offset?: number, limit?: number): Promise<T[]>;

  exist(uniq: string): Promise<boolean>;

  upsert<T extends Object>(uniq: string, data: T): Promise<boolean>;

  insert<T extends Object>(uniq, data: T): Promise<boolean>;

  update<T extends Object>(uniq, data: T): Promise<boolean>;

  delete(uniq: string): Promise<boolean>;
}

export declare class LocalDB {
  constructor(root: string);

  tables(prefix?: string): Promise<string[]>;

  table(table_name: string): Promise<QueryTable>;
}