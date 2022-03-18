<template>
  <v-row justify="center" align="center">
    <v-col>
      <v-card class="py-4">
        <div class="px-4 py-4 text-h5">Preview</div>
        <div class="px-4 py-4">
          <div id="video" class="video"></div>
        </div>
      </v-card>
      <v-card class="py-4 px-4">
        <v-form>
          <v-text-field
            :placeholder="placeholder"
            v-model="src"
            label="Video Url"
            clearable
          ></v-text-field>
          <span>Width: {{ width }}%</span>
          <v-slider min="1" v-model="width"> </v-slider>
          <span>Height: {{ height }}px</span>
          <v-slider min="100" max="1000" v-model="height"> </v-slider>
          <div v-if="src" class="col-sm-12 col-md-6 col-lg-5">
            <div class="px-4 py-4 text-h5">Timestamps</div>
            <div v-for="(ts, i) in timestamps" :key="i" class="d-flex">
              <v-text-field
                v-model="ts.title"
                class="mr-4"
                label="Title"
                @change="updateVideo"
                clearable
              >
              </v-text-field>
              <v-text-field
                v-model="ts.minutes"
                class="mr-4"
                label="Minutes"
                @change="updateVideo"
                clearable
              >
              </v-text-field>
              <v-text-field
                v-model="ts.seconds"
                label="Seconds"
                @change="updateVideo"
                clearable
              >
              </v-text-field>
              <v-btn
                class="ml-4 align-self-center"
                fab
                dark
                x-small
                color="primary"
                @click="deleteTs(i)"
              >
                <v-icon dark> mdi-minus </v-icon>
              </v-btn>
            </div>
            <v-btn fab dark x-small color="primary" @click="addTs">
              <v-icon dark> mdi-plus </v-icon>
            </v-btn>
          </div>
        </v-form>
      </v-card>
      <v-card class="py-4">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="copy"
              fab
              dark
              x-small
              color="primary"
              @click="copy"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon dark> mdi-content-copy </v-icon>
            </v-btn>
          </template>
          <span>Copy</span>
        </v-tooltip>
        <v-snackbar
          v-model="copySuccess"
          class="mr-15 pt-3"
          color="success"
          :timeout="1500"
          light
          absolute
          top
          right
        >
          Copied!
        </v-snackbar>
        <v-snackbar
          v-model="copyFail"
          class="mr-15 pt-3"
          color="error"
          :timeout="1500"
          light
          top
          right
        >
          Error!
        </v-snackbar>
        <v-textarea class="mx-4" :value="script" auto-grow outlined success>
        </v-textarea>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      id: "video",
      src: "https://player.vimeo.com/video/358305100",
      timestamps: [{ title: "Beginning", minutes: 0, seconds: 0 }],
      width: 100,
      height: 450,
      placeholder: "//player.vimeo.com/video/358305100",
      div: '<div id="video"></div>',
      css: `<link rel="stylesheet" href="${window.location.href}vimeots.css">`,
      js: `<${"script"} src="${window.location.href}vimeots.js"></${"script"}>`,
      copySuccess: false,
      copyFail: false,
    };
  },
  computed: {
    formattedTs() {
      return this.timestamps.map((ts) => ({
        title: ts.title,
        timestamp: `${ts.minutes}m${ts.seconds}s`,
      }));
    },
    videoData() {
      return {
        id: this.id,
        src: this.src,
        timestamps: this.formattedTs,
        width: `${this.width}%`,
        height: this.height,
      };
    },
    formattedVideoData() {
      return JSON.stringify(this.videoData, null, 8);
    },
    videoScript() {
      return `<${"script"}>\n\tcreateVimeots(${
        this.formattedVideoData
      })\n<${"/script"}>`;
    },
    script() {
      return `${this.div}\n${this.css}\n${this.js}\n${this.videoScript}`;
    },
  },
  watch: {
    src() {
      this.updateVideo();
    },
    width() {
      this.updateVideo();
    },
    height() {
      this.updateVideo();
    },
  },
  methods: {
    updateVideo() {
      let ts = document.querySelector("#video-tsButtons");
      if (ts) ts.remove();
      if (this.src) createVimeots(this.videoData);
    },
    addTs() {
      this.timestamps.push({ title: "", minutes: "", seconds: "" });
    },
    deleteTs(i) {
      this.timestamps.splice(i, 1);
    },
    copy() {
      const type = "text/plain";
      const blob = new Blob([this.videoScript], { type });
      let data = [new ClipboardItem({ [type]: blob })];
      navigator.clipboard
        .write(data)
        .then(() => (this.copySuccess = true))
        .catch((err) => console.log(err));
    },
  },
  mounted() {
    this.updateVideo();
  },
};
</script>
<style scoped>
.video {
  border: solid 2px grey;
  padding: 1rem;
  background: white;
  color: black;
}
.copy {
  position: absolute;
  z-index: 1000;
  top: calc(1rem + 10px);
  right: calc(1rem + 10px);
}
</style>
