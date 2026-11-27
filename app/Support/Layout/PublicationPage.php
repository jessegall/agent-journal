<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Connections\Layout\LayoutBodyData;
use Closure;

/**
 * The shared recipe of a publication page: its title, metadata and summary, the parts that stay under the header on
 * every tab, then its tabs, of which only the chosen one is read. With no tabs the body is shown instead, read once; a
 * domain hands in neutral values and readers only.
 */
final readonly class PublicationPage
{
    /**
     * @param  list<LayoutPartData>  $metadata
     * @param  Closure(): LayoutBodyData  $body
     * @param  list<PublicationTab>  $tabs
     * @param  list<LayoutPartData>  $standing  shown on every tab under the header, so a tab change keeps them mounted
     */
    private function __construct(
        public string $title,
        public array $metadata,
        public string $summary,
        public Closure $body,
        public array $tabs,
        public array $standing = [],
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
     * The page with parts that stay under its header whichever tab is shown, such as the editor of a held draft.
     */
    public function withStanding(LayoutPartData ...$parts): self
    {
        return clone ($this, ['standing' => array_values($parts)]);
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

        return DeclaredLayoutData::of(
            LayoutPartData::box('publication', 'stack', $header, ...[...$this->standing, $this->content($chosen)]),
        );
    }

    private function content(string $chosen): LayoutPartData
    {
        if ($this->tabs === []) {
            return LayoutPartData::body('body', ($this->body)());
        }

        return PublicationTab::setOf($this->tabs, $chosen);
    }
}
