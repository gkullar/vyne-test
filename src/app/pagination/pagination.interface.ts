export interface Pagination<T> {
  totalNumberOfItems: number;
  numberOfPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  items: Array<T>;
}
