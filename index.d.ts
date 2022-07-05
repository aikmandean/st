
type UnionToIntersection<T> = 
(T extends any ? (x: T) => any : never) extends 
  (x: infer R) => any ? R : never

type SimplifyContext<UnkCtx> = 
  UnionToIntersection<
    { [K in keyof UnkCtx]: 
      UnkCtx[K] extends IsComposable<UnkCtx[K]> 
        ? UnkCtx[K] extends ((p: infer P) => any)
          ? P extends never 
            ? {} 
            : P
          : K extends string 
            ? UnkCtx[K] extends HasFallback<UnkCtx[K]> 
                ? { [LK in Uncapitalize<K>]?: UnkCtx[K] } 
                : { [LK in Uncapitalize<K>]: UnkCtx[K] } 
            : never 
        : K extends string 
            ? UnkCtx[K] extends HasFallback<UnkCtx[K]> 
                ? { [LK in Uncapitalize<K>]?: UnkCtx[K] } 
                : { [LK in Uncapitalize<K>]: UnkCtx[K] } 
          : never 
    }[keyof UnkCtx]
  >

type ExcludeContext<Ctx, EclCtx> =
    EclCtx extends {} ? Omit<Ctx, Uncapitalize<keyof EclCtx>> : Ctx

// metadata toolkit

type MetadataAdd<M extends string> = { [s: symbol]: {[K in M]: true} }
type MetadataGet<M> = M extends {[s: symbol]: infer L} ? L : never
type MetadataIs<T, M> = MetadataGet<T> extends MetadataGet<M> 
  ? MetadataGet<T>[keyof MetadataGet<M>] extends never
    ? never 
    : T   
  : never
type MetadataRemove<T, M> = T extends {[s:symbol]: infer MVals} 
  ? T & {[s:symbol]: {[K in keyof MetadataGet<M>]: never}}
  : T

// built-in metadata

type DeclareComposable = MetadataAdd<"Composable">
type DeclareFallback = MetadataAdd<"Fallback">
type IsComposable<T> = MetadataIs<T, DeclareComposable>
type HasFallback<T> = MetadataIs<T, DeclareFallback>

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
  GFunction extends (props: GFallbackContext, identicalProps: GFallbackContext) => unknown,
  GExclusionContext extends {},
  GSimplifiedContext extends ExcludeContext<SimplifyContext<GUnknownContext>, GExclusionContext>,
  GFallbackContext extends Required<GSimplifiedContext>,
>(func: GFunction, context: GUnknownContext, exclusionContext?: GExclusionContext): 
  DeclareComposable & ((props: GSimplifiedContext) => ReturnType<GFunction>)

declare function defineProp<T,M extends {}>(defaultValue: T, metaData?: M): M extends { default: boolean } 
  ? MetadataRemove<T & DeclareFallback, DeclareComposable> 
  : MetadataRemove<T, DeclareComposable>

declare function TypeDefinition<
  GCtor extends (...a: any[]) => unknown, 
  GCsum extends (key: symbol, defaults: {[x:symbol]: unknown}, metadata: ReturnType<GCtor>, existing: ReturnType<GCsum>) => unknown
>(constructor: GCtor, consumer: GCsum, description: string): GCtor