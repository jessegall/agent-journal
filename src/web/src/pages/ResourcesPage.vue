<script setup>
import NavTile from "../kit/NavTile.vue";
import {useNavigation} from "../composables/navigation.js";
import {route} from "../route.js";

const {groups} = useNavigation();
</script>

<template>
    <section class="resources">
        <template v-for="g in groups" :key="g.key">
            <div class="resources-group">
                <h3 class="resources-head">{{ g.title }}</h3>
                <div class="resources-tiles">
                    <template v-for="link in g.links" :key="link.key">
                        <NavTile
                            :href="`#/${route.env}/${link.page}`"
                            :icon="link.icon"
                            :title="link.title"
                            :text="link.text"
                            :count="link.count"
                            :hot="link.hot"
                        />
                    </template>
                </div>
            </div>
        </template>
    </section>
</template>

<style scoped>
.resources {
    padding: 4px 22px 40px;
}

.resources-group {
    padding-top: 18px;
}

.resources-head {
    margin: 0 0 10px;
    color: var(--text-3);
    font-size: 11.5px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.resources-tiles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 10px;
}
</style>
