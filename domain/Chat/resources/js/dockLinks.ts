import { router } from "@inertiajs/vue3";

/**
 * Opens the page a dock card or one of its buttons links to; a card or button without a link opens nothing.
 */
export function visitLink(link: { href: string } | null): void {
  if (link !== null) {
    router.visit(link.href);
  }
}
