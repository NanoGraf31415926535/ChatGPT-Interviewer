// vite.config.js
import { defineConfig, loadEnv } from "file:///Volumes/INTENSO/Examples/bmt-template-minimal-group-paradigm/node_modules/vite/dist/node/index.js";
import react from "file:///Volumes/INTENSO/Examples/bmt-template-minimal-group-paradigm/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { viteStaticCopy } from "file:///Volumes/INTENSO/Examples/bmt-template-minimal-group-paradigm/node_modules/vite-plugin-static-copy/dist/index.js";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            src: "local_packages/*/locales/*",
            dest: ""
          }
        ],
        structured: true
      })
    ],
    build: {
      target: "ES2022"
    },
    base: env.VITE_BASE_PATH
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVm9sdW1lcy9JTlRFTlNPL0V4YW1wbGVzL2JtdC10ZW1wbGF0ZS1taW5pbWFsLWdyb3VwLXBhcmFkaWdtXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVm9sdW1lcy9JTlRFTlNPL0V4YW1wbGVzL2JtdC10ZW1wbGF0ZS1taW5pbWFsLWdyb3VwLXBhcmFkaWdtL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Wb2x1bWVzL0lOVEVOU08vRXhhbXBsZXMvYm10LXRlbXBsYXRlLW1pbmltYWwtZ3JvdXAtcGFyYWRpZ20vdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3YydcbmltcG9ydCB7IHZpdGVTdGF0aWNDb3B5IH0gZnJvbSAndml0ZS1wbHVnaW4tc3RhdGljLWNvcHknXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHttb2RlfSkgPT4ge1xuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKTtcbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICByZWFjdCgpLFxuICAgICAgdml0ZVN0YXRpY0NvcHkoe1xuICAgICAgICB0YXJnZXRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnbG9jYWxfcGFja2FnZXMvKi9sb2NhbGVzLyonLFxuICAgICAgICAgICAgZGVzdDogJydcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIHN0cnVjdHVyZWQ6IHRydWVcbiAgICAgIH0pXG4gICAgXSxcbiAgICBidWlsZDoge1xuICAgICAgdGFyZ2V0OiBcIkVTMjAyMlwiXG4gICAgfSxcbiAgICBiYXNlOiBlbnYuVklURV9CQVNFX1BBVEhcbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVcsU0FBUyxjQUFjLGVBQWU7QUFDL1ksT0FBTyxXQUFXO0FBQ2xCLFNBQVMsc0JBQXNCO0FBRy9CLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUMsS0FBSSxNQUFNO0FBQ3RDLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUMzQyxTQUFPO0FBQUEsSUFDTCxTQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUEsTUFDTixlQUFlO0FBQUEsUUFDYixTQUFTO0FBQUEsVUFDUDtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsTUFBTTtBQUFBLFVBQ1I7QUFBQSxRQUNGO0FBQUEsUUFDQSxZQUFZO0FBQUEsTUFDZCxDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLElBQ1Y7QUFBQSxJQUNBLE1BQU0sSUFBSTtBQUFBLEVBQ1o7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
