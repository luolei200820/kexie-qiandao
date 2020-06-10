<template>
  <v-app>
    <v-app-bar app dark :color="$vuetify.theme.dark?'grey darken-4':'blue lighten-3'">
      <div class="d-flex align-center">
        <v-img
          alt="kexie Logo"
          class="shrink mr-2"
          contain
          src="../public/logo.jpg"
          transition="scale-transition"
          width="40"
        />

        <v-toolbar-title>三院科协</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <v-app-bar-nav-icon @click="drawer = true">
        <v-icon>{{svgPath.mdiMenu}}</v-icon>
      </v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" fixed temporary>
      <v-list nav dense>
        <v-list-item-group>
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>{{svgPath.mdiApps}}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>首页</v-list-item-title>
          </v-list-item>

          <v-list-item to="/rank">
            <v-list-item-icon>
              <v-icon>{{svgPath.mdiEqualizer}}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>排名</v-list-item-title>
          </v-list-item>

          <v-list-item to="/about">
            <v-list-item-icon>
              <v-icon>{{svgPath.mdiInformationOutline}}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>关于</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <v-switch v-model="$vuetify.theme.dark" class="ml-4" label="Theme Dark"></v-switch>
      </template>
    </v-navigation-drawer>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import { mdiApps, mdiMenu, mdiInformationOutline, mdiEqualizer } from '@mdi/js'
export default {
  data: () => ({
    svgPath: {
      mdiApps,
      mdiMenu,
      mdiInformationOutline,
      mdiEqualizer
    },
    drawer: false
  }),
  watch: {
    '$vuetify.theme.dark': newQuestion => {
      localStorage.setItem('themeDark', newQuestion)
    }
  },
  mounted() {
    if (
      localStorage.getItem('themeDark') === 'true' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      this.$vuetify.theme.dark = true
    } else {
      this.$vuetify.theme.dark = false
    }
  }
}
</script>

<style>
.v-alert--prominent .v-alert__icon.v-icon svg {
  width: 32px;
  height: 32px;
}
.data-table-td-mw100 {
  min-width: 100px;
}
</style>
