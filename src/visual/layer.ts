import { set, get } from 'dot-prop-immutable'


interface IVisibleGroup {
    map: any;
    groupId: string;
    type: "visible" | "none";
    options?: {
        groupKey?: string;
        onlyGroup?: boolean;
        returnStyle?: boolean
    }
}

interface IRenderGroup {
    styles: any;
    groupIds: string[]
    options?: {
        groupKey?: string;
    }
}

interface IRenderLayer {
    styles: any;
    metadataKey: string
}

interface ISelectLayers {
    styles: any;
    args: string[]
}

const visibleGroup = ({ map, groupId, type, options }: IVisibleGroup) => {
    const { groupKey, onlyGroup, returnStyle } = options;
    const key = groupKey ? groupKey : "vallaris:group";
    const styles = map.getStyle()
    const { layers } = styles
    let newLayers: any[] = [];

    for (let i = 0; i < layers.length; i++) {
        const layer = layers[i]
        if (layer.metadata && layer.metadata[key] && layer.metadata[key] === groupId) {
            let input = { ...layer };
            const newInput = set(input, "layout.visibility", type);

            newLayers.push(newInput);

            map.setLayoutProperty(layer.id, 'visibility', type)
        } else {
            newLayers.push(layer);

            if (onlyGroup && type === 'visible') map.setLayoutProperty(layer.id, 'visibility', 'none')
        }
    }

    if (returnStyle) {
        let newStyle = { ...styles };
        newStyle.layers = newLayers;

        return newStyle;
    }

}

const renderGroup = ({ styles, groupIds, options }: IRenderGroup) => {
    const { groupKey } = options
    const key = groupKey ? groupKey : "vallaris:group";
    let groups: any = [];
    const { layers } = styles

    const filterLayers = layers.filter(
        (l: any) => l.metadata && l.metadata[key] && groupIds.includes(l.metadata[key])
    );

    filterLayers.map((l: any) => {
        const layers = renderLayers({ styles: styles, metadataKey: l.metadata[key] });
        let input = { groupId: l.metadata[key], layers: layers };
        groups.push(input);
    });

    return groups;
}

const selectLayers = ({ styles, args }: ISelectLayers) => {
    const { layers } = styles;

    let newRender: any[] = [];

    layers.map((l: any) => {
        if (args.includes(l.id)) {
            newRender.push(l);
        }
    });

    return newRender;
}

const renderLayers = ({ styles, metadataKey }: IRenderLayer) => {
    const { layers } = styles;

    let newRender: any[] = [];

    layers.map((l: any) => {
        const newMetadata = get(l, "metadata")
            ? Object.keys(get(l, "metadata")).filter((mt) => mt === metadataKey)
            : [];

        if (newMetadata.length) {
            newRender.push(l);
        }
    });

    return newRender;
}

export { visibleGroup, renderGroup, selectLayers, renderLayers }