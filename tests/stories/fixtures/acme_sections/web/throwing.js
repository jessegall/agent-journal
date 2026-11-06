// throws while it draws, so its host shows the failure with Retry
export default {
    setup() {
        return () => {
            throw new Error("this section broke");
        };
    },
};
