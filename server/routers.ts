import { systemRouter } from "./_core/systemRouter";
import { router } from "./_core/trpc";
import { videosRouter } from "./routers/videos";
import { reportsRouter } from "./routers/reports";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  videos: videosRouter,
  reports: reportsRouter,

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: publicProcedure.query(() =>
  //     db.getTodos()
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
