const Log = (target: any, key: string, descriptor: PropertyDescriptor) => {
  const original = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    console.log(`[${new Date().toISOString()}]  ${key}() called`, args);
    const result = await original.apply(this, args);
    console.log(`[${new Date().toISOString()}] ${key}() done`, result);
    return result;
  };
  return descriptor;
};

export default Log