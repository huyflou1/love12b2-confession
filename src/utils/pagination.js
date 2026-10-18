export const PAGE_SIZE = 20;

export const paginate = (items, requestedPage, size = PAGE_SIZE) => {
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const offset = (page - 1) * size;
  return { page, totalPages, offset, items: items.slice(offset, offset + size) };
};