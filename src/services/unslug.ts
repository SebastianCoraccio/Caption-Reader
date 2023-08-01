// slugs are human-readable identifiers
// ex: unslug('my-trip-last-year') => 'My trip last year'
export function unslug(slug: string) {
  return slug[0].toLocaleUpperCase() + slug.slice(1).replace(/[-/]/g, ' ');
}
