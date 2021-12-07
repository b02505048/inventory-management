<template>
  <q-table
    :rows="reactive_titles"
    :columns="columns"
    :rows-per-page-options="[0]"
    row-key="title_id"
    :filter="query"
    :filter-method="customFilterMethod"
  >
    <template v-slot:top-left>
      <div class="search-bar">
        <q-input
          outlined
          dense
          debounce="300"
          v-model="query"
          placeholder="Search for titles in inventory"
          class="q-my-md"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </template>

    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          class="table-header"
        >
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>

    <template v-slot:body="props">
      <q-tr :props="props" class="table-row">
        <q-td key="expandable" :props="props">
          <q-btn
            flat
            round
            dense
            v-show="props.row.seasons.length > 0"
            @click="expansion(props.row)"
          >
            <img
              v-if="!!props.row.is_expanded"
              class="expansion-icon"
              src="~assets/icons/expand.png"
            />
            <img
              v-else
              class="expansion-icon"
              src="~assets/icons/collapse.png"
            />
          </q-btn>
        </q-td>
        <q-td key="title_id" :props="props">
          {{ props.row.title_id }}
        </q-td>
        <q-td key="title_name" :props="props">
          {{ props.row.title_name }}
        </q-td>
        <q-td key="content_type" :props="props">
          {{ props.row.content_type }}
        </q-td>
        <q-td key="seasons" :props="props">
          <div v-if="props.row.seasons.length > 0">
            {{ props.row.seasons.length }}
          </div>
          <div v-else>--</div>
        </q-td>
        <q-td key="episode_count" :props="props">
          <div v-if="props.row.episode_count > 1">
            {{ props.row.episode_count }}
          </div>
          <div v-else>--</div>
        </q-td>
        <q-td key="publish_timestamp" :props="props">
          {{ formatDate(props.row.publish_timestamp) }}
        </q-td>
        <q-td key="activate" :props="props">
          <q-toggle
            v-model="props.row.activate"
            color="green"
            @update:model-value="toggleTitle(props.row)"
          />
          <span v-if="props.row.activate && checkAllSeasons(props.row)"
            >All Seasons</span
          >
        </q-td>
      </q-tr>

      <q-tr v-show="props.row.is_expanded" :props="props">
        <q-td colspan="100%" class="second-row-wrapper">
          <div
            v-for="(season, index) in props.row.seasons"
            :key="props.row.seasons[index].season_id"
          >
            <q-tr>
              <q-td class="second-row-expansion"> </q-td>
              <q-td class="id-col">
                <q-btn
                  flat
                  round
                  dense
                  v-show="season.episodes.length > 0"
                  @click="expansion(season)"
                >
                  <img
                    v-if="season.is_expanded"
                    class="minus-plus-icon"
                    src="~assets/icons/minus.png"
                  />
                  <img
                    v-else
                    class="minus-plus-icon"
                    src="~assets/icons/plus.png"
                  />
                </q-btn>
                {{ season.season_id }}
              </q-td>
              <q-td class="name-col">
                {{ season.season_name }}
              </q-td>
              <q-td class="genre-col"> Season </q-td>
              <q-td class="season-col">
                {{ `S${season.season_number}` }}
              </q-td>
              <q-td class="ep-col">
                {{ season.episode_count }}
              </q-td>
              <q-td class="date-col"> -- </q-td>
              <q-td class="activate-col">
                <q-toggle
                  v-model="season.activate"
                  color="green"
                  @update:model-value="
                    toggleSeason(props.row, season, season.activate)
                  "
                />
                <span v-if="season.activate && checkAllEpisodes(season)"
                  >All Episodes</span
                >
              </q-td>
            </q-tr>

            <q-tr v-show="season.is_expanded" :props="props">
              <q-td colspan="100%" class="third-row-wrapper">
                <q-tr
                  v-for="(episode, index) in season.episodes"
                  :key="season.episodes[index].episode_id"
                >
                  <q-td class="third-row-expansion"> </q-td>
                  <q-td class="id-col">
                    {{ episode.episode_id }}
                  </q-td>
                  <q-td class="name-col">
                    {{ !!episode.episode_name ? episode.episode_name : "--" }}
                  </q-td>
                  <q-td class="genre-col"> Episode </q-td>
                  <q-td class="season-col"> -- </q-td>
                  <q-td class="ep-col">
                    {{ `EP${episode.episode_number}` }}
                  </q-td>
                  <q-td class="date-col"> -- </q-td>
                  <q-td class="activate-col">
                    <q-toggle
                      v-model="episode.activate"
                      color="green"
                      @update:model-value="
                        toggleEpisode(props.row, season, episode.activate)
                      "
                    />
                  </q-td>
                </q-tr>
              </q-td>
            </q-tr>
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import formatDate from "src/helpers/formatDate";
import titles from "src/data/titles";

export default defineComponent({
  name: "InventoryTable",

  data() {
    return {
      columns: [
        {
          name: "expandable",
          label: "",
          align: "left",
          field: "expandable",
          style: "width: 10px;",
        },
        {
          name: "title_id",
          label: "ID",
          align: "left",
          field: "title_id",
          style: "width: 100px",
        },
        {
          name: "title_name",
          label: "Title Name",
          align: "left",
          field: "title_name",
          style: "width: 350px",
        },
        {
          name: "content_type",
          label: "Type",
          align: "left",
          field: "content_type",
          style: "width: 80px",
        },
        {
          name: "seasons",
          label: "Season",
          align: "left",
          field: "seasons",
          style: "width: 80px",
        },
        {
          name: "episode_count",
          label: "Episode",
          align: "left",
          field: "episode_count",
          style: "width: 80px",
        },
        {
          name: "publish_timestamp",
          label: "Published",
          align: "left",
          field: "publish_timestamp",
          style: "auto",
        },
        {
          name: "activate",
          label: "Programmable",
          align: "left",
          field: "activate",
          style: "width: 200px",
        },
      ],
    };
  },

  setup() {
    const reactive_titles = reactive(titles);
    return {
      formatDate,
      query: ref(""),
      reactive_titles,
    };
  },

  methods: {
    expansion(row) {
      row.is_expanded = !row.is_expanded;
    },

    checkAllSeasons(row) {
      let activateCount = 0;
      for (let i = 0; i < row.seasons.length; i++) {
        if (row.seasons[i].activate) activateCount++;
      }

      return activateCount === row.seasons.length ? true : false;
    },

    checkAllEpisodes(season) {
      let activateCount = 0;
      for (let i = 0; i < season.episodes.length; i++) {
        if (season.episodes[i].activate) activateCount++;
      }

      return activateCount === season.episodes.length ? true : false;
    },

    customFilterMethod() {
      // console.log("Filtering..");
      // let filtered = this.reactive_titles.filter((title) => {
      //   return title["title_name"]
      //     .toLowerCase()
      //     .includes(this.query.toLowerCase());
      // });

      if (this.query === "") return this.reactive_titles;

      let filtered = [];

      for (let title of this.reactive_titles) {
        // Destructuring
        const { title_name, seasons = [] } = title;

        // Append the matched titles
        if (title_name.toLowerCase().includes(this.query.toLowerCase())) {
          filtered.push(title);
          continue;
        }

        if (seasons.length === 0) continue;

        for (let season of seasons) {
          const { season_name, episodes } = season;

          // Append the matched seasons
          if (season_name.toLowerCase().includes(this.query.toLowerCase())) {
            filtered.push(title);
            break;
          }

          if (episodes.length === 0) continue;

          for (let ep of episodes) {
            const { episode_name } = ep;

            // Append the matched episode
            if (episode_name.toLowerCase().includes(this.query.toLowerCase())) {
              filtered.push(title);
              break;
            }
          }
        }
      }

      // for (let i = 0; i < this.reactive_titles.length; i++) {
      //   if (this.reactive_titles[i].seasons.length > 0) {
      //     this.reactive_titles[i].seasons.forEach((season) => {
      //       if (
      //         season["season_name"]
      //           .toLowerCase()
      //           .includes(this.query.toLowerCase())
      //       ) {
      //         filtered.push(this.reactive_titles[i]);
      //       }
      //       return;
      //     });
      //   }
      // }

      return filtered;
    },

    toggleTitle(row) {
      for (let i = 0; i < row.seasons.length; i++) {
        row.seasons[i].activate = row.activate;
        this.toggleSeason(row, row.seasons[i], row.activate);
      }
    },

    toggleSeason(row, season, status) {
      if (status === true) {
        row.activate = status;
        for (let i = 0; i < season.episodes.length; i++) {
          season.episodes[i].activate = status;
        }
        return;
      }

      // Self update
      season.activate = status;

      // Turn off all the episodes
      for (let i = 0; i < season.episodes.length; i++) {
        season.episodes[i].activate = status;
      }

      // Check whether should turn off the title
      let activateCount = 0;
      for (let i = 0; i < row.seasons.length; i++) {
        if (row.seasons[i].activate === true) activateCount++;
      }
      row.activate = activateCount === 0 ? false : true;
      return;
    },

    toggleEpisode(row, season, status) {
      if (status === true) {
        row.activate = true;
        season.activate = true;
        return;
      }

      let activateCount = 0;
      // Check whether other episodes are turned on or not
      for (let i = 0; i < season.episodes.length; i++) {
        if (season.episodes[i].activate === true) activateCount++;
      }
      console.log(activateCount);
      if (activateCount === 0) this.toggleSeason(row, season, false);
      return;
    },
  },
});
</script>

<style scoped>
.search-bar {
  width: 419px;
}

.table-header {
  height: 48px;
  background: rgba(32, 32, 32, 0.05);
}

.table-row:hover {
  background: rgba(78, 160, 221, 0.1);
}

.expansion-icon {
  height: 16px;
  width: 16px;
  padding: 4px 3px;
  cursor: pointer;
}

.second-row-wrapper {
  padding: 0px;
}

.second-row-expansion {
  width: 40px;
}

.third-row-wrapper {
  padding: 0px;
}

.third-row-expansion {
  width: 100px;
}

.id-col {
  width: 100px;
}

.name-col {
  width: 350px;
}

.genre-col,
.season-col,
.ep-col {
  width: 80px;
}

.date-col {
  width: auto;
}

.activate-col {
  width: 200px;
}

.minus-plus-icon {
  height: 16px;
  width: 16px;
}
</style>
