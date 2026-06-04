const Validate = (...fields: string[]) => {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = async function (data: any, ...rest: any[]) {
      for (const field of fields) {
        if (!data[field])
          return { success: false, error: `${field} is required` };
      }
      return original.apply(this, [data, ...rest]);
    };
    return descriptor;
  };
}

export default Validate