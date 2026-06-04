//Measures how long a method takes to run.
const MeasureTime = (target: any, key: string, descriptor: PropertyDescriptor) => {
  const original = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    const start  = Date.now();
    const result = await original.apply(this, args);
    const end    = Date.now();
    console.log(`${key}() took ${end - start}ms`);
    return result;
  };
  return descriptor;
}

export default MeasureTime