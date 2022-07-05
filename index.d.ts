
type UnionToIntersection<T> = 
(T extends any ? (x: T) => any : never) extends 
  (x: infer R) => any ? R : never

type SimplifyContext<UnkCtx> = 
  UnionToIntersection<
    { [K in keyof UnkCtx]: 
      UnkCtx[K] extends Composable 
        ? UnkCtx[K] extends ((p: infer P) => any)
          ? P extends never 
            ? {} 
            : P
          : K extends string 
            ? UnkCtx[K] extends IsOptional 
                ? { [LK in Uncapitalize<K>]?: UnkCtx[K] } 
                : { [LK in Uncapitalize<K>]: UnkCtx[K] } 
            : never 
        : K extends string 
            ? UnkCtx[K] extends IsOptional 
                ? { [LK in Uncapitalize<K>]?: UnkCtx[K] } 
                : { [LK in Uncapitalize<K>]: UnkCtx[K] } 
          : never 
    }[keyof UnkCtx]
  >

type ExcludeContext<Ctx, EclCtx> =
    EclCtx extends {} ? Omit<Ctx, Uncapitalize<keyof EclCtx>> : Ctx

type Composable = {[s:symbol]: "Composable"}
type IsOptional = {[s:symbol]: "Optional"}

type Is<T, M> = T extends {[s:symbol]: infer MVal} 
  ? MVal extends M 
    ? true 
    : false 
  : false

/**
 * A function that takes a defining function then its 
 * prop requirements. It returns the defining function 
 * but annotated using the prop requirements.
 * 
 * ### Defining function
 * Takes props object, no return constraints
 *   
 * ### Prop requirements
 * An object made of objects or functions. 
 * Functions are polled for their prop requirements 
 * then aggregated. Individual props have a name, 
 * the name will be "Uncapitalized". Props will 
 * be added to prop requirements in groups using a symbol key.
 */
declare function fn<
  GUnknownContext,
  GFunction extends (props: GSimplifiedContext, identicalProps: GSimplifiedContext) => unknown,
  GExclusionContext extends {},
  GSimplifiedContext extends ExcludeContext<SimplifyContext<GUnknownContext>, GExclusionContext>,
>(func: GFunction, context: GUnknownContext, exclusionContext?: GExclusionContext): 
  Composable & ((props: GSimplifiedContext) => ReturnType<GFunction>)

declare function defineProp<T,M extends {}>(defaultValue: T, metaData?: M): M extends { default: boolean } ? T & IsOptional : T

declare function TypeDefinition<
  GCtor extends (...a: any[]) => unknown, 
  GCsum extends (key: symbol, defaults: {[x:symbol]: unknown}, metadata: ReturnType<GCtor>, existing: ReturnType<GCsum>) => unknown
>(constructor: GCtor, consumer: GCsum, description: string): GCtor