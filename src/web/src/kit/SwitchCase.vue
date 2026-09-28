<script>
import {Comment, defineComponent} from "vue";

export default defineComponent({
    props: {value: {type: [String, Number], default: ""}},
    setup(props, {slots}) {
        return () => {
            const chosen = slots[String(props.value)] || slots.default;
            const nodes = (chosen ? chosen() : []).filter((node) => node.type !== Comment);
            return nodes.length === 1 ? nodes[0] : nodes;
        };
    },
});
</script>
