<?php

declare(strict_types=1);

namespace App\Ui\Layout;

use Closure;

/**
 * The shared recipe of a publication page: its title, metadata and summary, then its tabs, of which only the chosen
 * one is read. With no tabs the body is shown instead, read once; a domain hands in neutral values and readers only.
 */
final readonly class PublicationPage
{
    /**
     * @param  list<LayoutPartData>  $metadata
     * @param  Closure(): LayoutBodyData  $body
     * @param  list<PublicationTab>  $tabs
     */
    private function __construct(
        public string $title,
        public array $metadata,
        public string $summary,
        public Closure $body,
        public array $tabs,
    ) {}

    /**
     * @param  list<LayoutPartData>  $metadata
     * @param  Closure(): LayoutBodyData  $body
     * @param  list<PublicationTab>  $tabs
     */
    public static function make(string $title, array $metadata, string $summary, Closure $body, array $tabs): self
    {
        return new self($title, $metadata, $summary, $body, $tabs);
    }

    /**
     * The page as a layout, showing the tab the window's query chose, or the first when it chose none it has.
     */
    public function layout(string $chosen): DeclaredLayoutData
    {
        $header = LayoutPartData::box(
            'header',
            'header',
            LayoutPartData::text('title', $this->title, 'heading'),
            LayoutPartData::box('metadata', 'row', ...$this->metadata),
            LayoutPartData::text('summary', $this->summary, 'muted'),
        );

        return DeclaredLayoutData::of(LayoutPartData::box('publication', 'stack', $header, $this->content($chosen)));
    }

    private function content(string $chosen): LayoutPartData
    {
        if ($this->tabs === []) {
            return LayoutPartData::body('body', ($this->body)());
        }

        $shown = $this->chosenTab($chosen);

        $tabs = array_map(
            fn (PublicationTab $tab) => new LayoutTabData($tab->key, $tab->label, $tab->key === $shown->key),
            $this->tabs,
        );

        return LayoutPartData::tabs('tabs', $tabs, ($shown->read)());
    }

    private function chosenTab(string $chosen): PublicationTab
    {
        foreach ($this->tabs as $tab) {
            if ($tab->key === $chosen) {
                return $tab;
            }
        }

        return $this->tabs[0];
    }
}
