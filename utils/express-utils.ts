import express, { Request, Response, NextFunction } from "express";
export function jaction(asyncFunc: Function) {
  const wrapFunc = async (req: Request, res: Response) => {
    const result = await asyncFunc(req, res);
    return result;
  };
  return function requestHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    wrapFunc(req, res)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  };
}

export function notFound(req: Request, res: Response) {
  res.status(404).send("not found");
}
