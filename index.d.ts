export declare class QueryTable {
  constructor(datapath: string);

  /**
   * count data
   */
  count(): Promise<number>;

  /**
   * find data by uniq
   */
  find<T extends Object>(uniq: string): Promise<T | undefined>;

  /**
   * @param datapath 
   * @param offset default is 0
   * @param limit default is -1, means no limit
   */
  select<T extends Object>(offset?: number, limit?: number): Promise<T[]>;

  /**
   * check data is exist
   */
  exist(uniq: string): Promise<boolean>;

  /**
   * insert or update data
   */
  upsert<T extends Object>(uniq: string, data: T): Promise<boolean>;

  /**
   * upsert many data
   * return failed row
   */
  upsertMany<T extends Object>(data: T[]): Promise<T[]>;

  /**
   * insert data only if uniq is not exist
   */
  insert<T extends Object>(uniq, data: T): Promise<boolean>;

  /**
   * update data only if uniq is exist
   */
  update<T extends Object>(uniq, data: T): Promise<boolean>;

  /**
   * delete data by uniq
   */
  delete(uniq: string): Promise<boolean>;
}

export declare class LocalDB {
  constructor(root: string);

  /**
   * get table list
   */
  tables(prefix?: string): Promise<string[]>;

  /**
   * get table instance
   */
  table(table_name: string): QueryTable;
}
