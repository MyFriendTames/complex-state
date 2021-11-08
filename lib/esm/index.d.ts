export declare const useComplexState: <StateType>(defaultValue: StateType) => (StateType | (<PropertyType>(path: string, value: PropertyType | ((prev: PropertyType) => void)) => false | void))[];
