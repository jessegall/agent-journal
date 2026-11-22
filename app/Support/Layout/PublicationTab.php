<?php

declare(strict_types=1);

namespace App\Support\Layout;

use Closure;

/**
 * One tab of a publication: its key, its label, and the reader of its content, called only when the tab is shown.
 */
final readonly class PublicationTab
{
    /**
     * @param  Closure(): LayoutPartData  $read
     */
    private function __construct(
        public string $key,
        public string $label,
        public Closure $read,
    ) {}

    /**
     * The tab set of these tabs, with the tab the window's query chose, or the first when it chose none they have, as
     * the only one read.
     *
     * @param  non-empty-list<self>  $tabs
     */
    public static function setOf(array $tabs, string $chosen): LayoutPartData
    {
        $shown = $tabs[0];

        foreach ($tabs as $tab) {
            if ($tab->key === $chosen) {
                $shown = $tab;
            }
        }

        $choices = array_map(
            fn (self $tab) => new LayoutTabData($tab->key, $tab->label, $tab->key === $shown->key),
            $tabs,
        );

        return LayoutPartData::tabs('tabs', $choices, ($shown->read)());
    }

    /**
     * @param  Closure(): LayoutPartData  $read
     */
    public static function deferred(string $key, string $label, Closure $read): self
    {
        return new self($key, $label, $read);
    }
}
