export interface FilterInput {
    name: string;
    type : FilterType;
    detail: FilterInputDetail[];
}
export interface FilterInputDetail {
    id: number;
    name : string;
}
export enum FilterType {
    id,
    name,
    dates,
    list,
    plane,
    customGroup,
    customActivity,
    rangeDate
}
export interface FilterOutput {
    filter:FilterInput;
    search: any;
    name : string;
}