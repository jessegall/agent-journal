import {shallowRef} from "vue";

// the declarations modules make of one kind, read from one address and found by their type
export function declarationRegistry(address, listed) {
    const declarations = shallowRef(new Map());
    const load = (list) => (declarations.value = new Map(list.map((declaration) => [declaration.type, declaration])));
    const read = async () => {
        try {
            return (await (await fetch(address)).json())[listed] || [];
        } catch (error) {
            return [];
        }
    };
    return {load, read, fetchAll: async () => load(await read()), find: (type) => declarations.value.get(type) || null};
}
