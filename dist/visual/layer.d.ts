interface IVisibleGroup {
    map: any;
    groupId: string;
    type: "visible" | "none";
    options?: {
        groupKey?: string;
        onlyGroup?: boolean;
        returnStyle?: boolean;
    };
}
interface IRenderGroup {
    styles: any;
    groupIds: string[];
    options?: {
        groupKey?: string;
    };
}
interface IRenderLayer {
    styles: any;
    metadataKey: string;
}
interface ISelectLayers {
    styles: any;
    args: string[];
}
declare const visibleGroup: ({ map, groupId, type, options }: IVisibleGroup) => any;
declare const renderGroup: ({ styles, groupIds, options }: IRenderGroup) => any;
declare const selectLayers: ({ styles, args }: ISelectLayers) => any[];
declare const renderLayers: ({ styles, metadataKey }: IRenderLayer) => any[];
export { visibleGroup, renderGroup, selectLayers, renderLayers };
//# sourceMappingURL=layer.d.ts.map