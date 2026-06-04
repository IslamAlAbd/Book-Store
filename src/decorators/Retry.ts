//Retries a method if it fails (useful for DB connection issues).
const Retry =(times: number = 3) => {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      for (let i = 0; i < times; i++) {
        try {
          return await original.apply(this, args);
        } catch (error) {
          console.warn(`⚠️ ${key}() failed, retry ${i + 1}/${times}`);
          if (i === times - 1) throw error;
        }
      }
    };
    return descriptor;
  };
}

export default Retry