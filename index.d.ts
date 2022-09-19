export function TypeDefinition<
  GCtor extends (...a: any[]) => unknown, 
  GCsum extends (key: symbol, defaults: {[x:symbol]: unknown}, metadata: ReturnType<GCtor>, existing: ReturnType<GCsum>) => unknown
>(description: string, constructor?: GCtor, consumer?: GCsum): [GCtor,(o:any)=>ReturnType<GCtor>&((o:any,v:ReturnType<GCtor>)=>ReturnType<GCtor>)]

export function fn<
  GDefs extends {}[],
  GFunc extends (props: CAsArgs) => unknown,
  CInfos = Internals.Util.UnionToIntersection<Internals.Fn.Index<GDefs>>,
  CName = "anonymous function",
  CProps = Omit<CInfos, symbol>,
  CAsArgs = { [K in keyof CProps]-?: Exclude<CProps[K], undefined> },
  CAsParams = { [K in keyof CProps]: CProps[K] }
>(func: GFunc, ...propDefs: GDefs):
  Extract<keyof CInfos, symbol> extends never ?
    & Name<CName>
    & ((props: CAsParams) => ReturnType<GFunc>)
  :
    & Name<CName>
    & ((props: CAsParams) => ReturnType<GFunc>)
    & Info<{[K in Extract<keyof CInfos, symbol>]: CInfos[K]}>

export function fn<
  GName extends string,
  GDefs extends {}[],
  GFunc extends (props: CAsArgs) => unknown,
  CInfos = Internals.Util.UnionToIntersection<Internals.Fn.Index<GDefs>>,
  CProps = Omit<CInfos, symbol>,
  CAsArgs = { [K in keyof CProps]-?: Exclude<CProps[K], undefined> },
  CAsParams = { [K in keyof CProps]: CProps[K] }
>(funcName: GName, func: GFunc, ...propDefs: GDefs):
  Extract<keyof CInfos, symbol> extends never ?
    & Name<GName>
    & ((props: CAsParams) => ReturnType<GFunc>)
  :
    & Name<GName>
    & ((props: CAsParams) => ReturnType<GFunc>)
    & Info<{[K in Extract<keyof CInfos, symbol>]: CInfos[K]}>

export function declareProps<T>(manyPropDefs: T): Internals.DeclareProps.Index<T>

namespace Internals {
  export namespace Fn {
    export type Index<T extends any[]> = { [K in keyof T]: PComposable<T[K]> }[number]
    export type PComposable<T> = T extends Name<any> & ((p: infer P) => any) ? P : T
  }

  export namespace DeclareProps {
    export type Index<T> = Util.UnionToIntersection<{ [K in keyof T]: {[UK in Capitalize<K>]: 
      
      T[K] extends Metadata.Pure<T[K]> 
        ? { [K1 in K]: T[K] } :
      T[K] extends Fallback 
        ? { [K1 in K]?: Metadata.Get<T[K]> } :
      T[K] extends Name<any> & ((p: infer P) => infer R) 
        ? { [K1 in K]: (p: P) => R } :
      { [K1 in K]: Metadata.Get<T[K]> }
    
    } }[keyof T]>
    
  }

  export namespace Util {
    export type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R : never
    export type LiteralLoss<T> = T extends number ? number : T extends string ? string : T extends boolean ? boolean : T
  }

  export namespace Declare {
    export const SFallback: unique symbol;
    export const SFuncname: unique symbol;
    export const SInfo: unique symbol;
    export const SBrand: unique symbol;
    export const SValue: unique symbol;
    export const S: unique symbol;
  }

  export namespace Metadata {
    export const S: typeof Declare.S;
    export const SV: typeof Declare.SValue;
    export type Pure<T> = T extends { [s: symbol]: { [S]: infer V } } ? V extends {} ? never : T : T 
    export type New<K,V=true> = { [s: symbol]: { [S]: { [K1 in K]: V } } }
    export type Safe<T> = T extends Pure<T> ? New<typeof SV, T> : T
    export type Get<T,K=typeof SV> = T[symbol][typeof S][K]
  }
}
export default Internals

type Fallback = Internals.Metadata.New<typeof Internals.Declare.SFallback>
type Brand<N> = Internals.Metadata.New<typeof Internals.Declare.SBrand, N>
type Name<N> = Internals.Metadata.New<typeof Internals.Declare.SFuncname, N>
type Info<N> = Internals.Metadata.New<typeof Internals.Declare.SInfo, N>

export function MOptional<T>(t: T): Internals.Metadata.Safe<Internals.Util.LiteralLoss<T>> & Fallback
export function MHide<T, E extends any[]>(t: T, ...e: E): Omit<Internals.Fn.PComposable<T>, keyof Internals.Util.UnionToIntersection<E[number]>>
export function MClass<F>(f:F): Internals.Metadata.Safe<ReturnType<F> & { [Internals.Declare.SBrand]: F }> & Brand<F>
export function MTry<
  T extends Brand<any>[symbol][typeof Internals.Declare.S],
  P extends F extends (p: infer P1) => any ? P1 : never,
  F = T extends Brand<infer F1>[symbol][typeof Internals.Declare.S] ? F1 : never
>(t: { [x: string]: T },p:P): T
export function MCast<T>(t:T,x:any): T