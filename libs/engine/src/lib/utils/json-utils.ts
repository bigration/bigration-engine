export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: string, value: unknown) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

export const jsonStringify = (value?: unknown): string | undefined => {
  if (!value) {
    return undefined;
  }

  return JSON.stringify(value, getCircularReplacer());
};
