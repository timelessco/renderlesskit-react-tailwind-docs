export default function flatten(list) {
  return list.reduce((flat, toFlatten) => {
    return flat.concat(
      Array.isArray(toFlatten)
        ? flatten(toFlatten)
        : toFlatten.children
        ? flatten(toFlatten.children)
        : toFlatten,
    );
  }, []);
}
