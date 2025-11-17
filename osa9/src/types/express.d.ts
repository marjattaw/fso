declare module 'express' {
  import { IncomingMessage, ServerResponse } from 'http';

  export interface Request extends IncomingMessage {
    query: Record<string, string | string[] | undefined>;
  }

  export interface Response extends ServerResponse {
    json: (body: unknown) => Response;
    send: (body?: unknown) => Response;
    status: (code: number) => Response;
  }

  export type RequestHandler = (req: Request, res: Response) => void;

  export interface ExpressApp {
    get: (path: string, handler: RequestHandler) => ExpressApp;
    use: (...handlers: RequestHandler[]) => ExpressApp;
    listen: (port: number, callback?: () => void) => void;
  }

  function express(): ExpressApp;

  export default express;
}
