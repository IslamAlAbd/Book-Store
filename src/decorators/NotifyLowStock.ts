const NotifyLowStock = (target: any, key: string, descriptor: PropertyDescriptor) => {
  const original = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    const result = await original.apply(this, args);
    if (result?.success && result?.data?.updatedBook) {
      const book = result.data.updatedBook;
      if (book.availableCopies <= book.minCopies)
        console.warn(`LOW STOCK: "${book.title}" has ${book.availableCopies} copies left`);
    }
    return result;
  };
  return descriptor;
}
export default NotifyLowStock