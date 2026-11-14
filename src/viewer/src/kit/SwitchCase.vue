<script>
import {Comment, Fragment, cloneVNode, defineComponent, h} from "vue";

export default defineComponent({
    props: {value: {type: [String, Number], default: ""}},
    setup(props, {slots}) {
        return () => {
            const name = slots[String(props.value)] ? String(props.value) : "default";
            const nodes = (slots[name] ? slots[name]() : []).filter((node) => node.type !== Comment);
            if (nodes.length !== 1) return h(Fragment, {key: name}, nodes);
            return nodes[0].key == null ? cloneVNode(nodes[0], {key: name}) : nodes[0];
        };
    },
});
</script>
