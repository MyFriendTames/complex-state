import { useState } from 'react';

export const useComplexState = < StateType, > ( defaultValue: StateType ) => {
  const [ state, setState ] = useState< StateType >( defaultValue );
  
  const _setState = < PropertyType, > ( value: PropertyType | ( ( prev: PropertyType ) => void ), path: string = '' ) => isValidPath( path ) && setState( prev => buildState( prev, path, value ) );
  
  const unset = ( path : string ) => isValidPath( path ) && setState( prev => buildState( prev, path, undefined, undefined, true ) );
  
  return [ state, _setState, unset ];
}
  
const buildState = ( prev: any, path: string | string[], value: any, tail = '', unset = false ): any => {
  if ( typeof path === 'string' ) path = ( path || '' ).split( '.' );
  if ( !path.length ){
    return typeof value === 'function' ? value( prev ) : value;
  }else{
    const isNull = prev == null;
    const key = path[ 0 ];
    const _unset = unset && path.length === 1;
    if ( !isNull && typeof prev === 'object' ){
      if ( !_unset ){
        const result = buildState( prev[ key ], path.slice( 1 ), value, !tail.length ? key : `${ tail }.${ key }`, unset );
        if ( Array.isArray( prev ) ){
          return prev.map( ( _prev, index ) => index == key as any ? result : _prev );
        }
        return { ...prev, [ key ]: result };
      }
      if ( Array.isArray( prev ) ){
        return prev.filter( ( _, index ) => index != key as any );
      }
      const { [ key ]: _, ...rest } = prev;
      return rest;
    }
    if ( !_unset ) throw new Error( `useComplexState: cannot read property '${ key }' of '${ isNull ? prev : typeof prev }' in '${ tail }'` );
    throw new Error( `useComplexState: cannot unset property '${ key }' of '${ isNull ? prev : typeof prev }' in '${ tail }'` );
  }
};

const isValidPath = ( path: string ) => {
  if ( typeof path === 'string' ) {
    return true;
  }
  throw new Error( `useComplexState: 'path' parameter must be a 'string' value` );
}