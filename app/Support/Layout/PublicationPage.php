<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Connections\Layout\LayoutBodyData;
use App\Web\Creation\Buildable;
use Closure;

/**
 * The shared recipe of a publication page: its title, metadata and summary, the parts that stay under the header on
 * every tab, then its tabs, of which only the chosen one is read. With no tabs the body is shown instead, read once; a
 * domain hands in neutral values and readers only.
 */
final readonly class PublicationPage
{
    /** @use Buildable<PublicationPageFields> */
    use Buildable;

    protected const string FIELDS = PublicationPageFields::class;

    /**
     * @param  list<LayoutPartData>  $metadata
     * @param  Closure(): LayoutBodyData  $body
     * @param  list<PublicationTab>  $tabs
     * @param  list<LayoutPartData>  $standing  shown on every tab under the header, so a tab change keeps them mounted
     */
    public function __construct(
        public string $title,
        public array $metadata,
        public string $summary,
        public Closure $body,
        public array $tabs,
        public array $standing = [],
    ) {}

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
        $header = LayoutPartData::build()
            ->asBox()
            ->key('header')
            ->style('header')
            ->children(
                LayoutPartData::build()->asText()->key('title')->value($this->title)->style('heading')->finish(),
                LayoutPartData::build()
                    ->asBox()
                    ->key('metadata')
                    ->style('row')
                    ->children(...$this->metadata)
                    ->finish(),
                LayoutPartData::build()->asText()->key('summary')->value($this->summary)->style('muted')->finish(),
            )
            ->finish();

        return DeclaredLayoutData::build()
            ->root(
                LayoutPartData::build()
                    ->asBox()
                    ->key('publication')
                    ->style('stack')
                    ->children($header, ...[...$this->standing, $this->content($chosen)])
                    ->finish(),
            )
            ->finish();
    }

    private function content(string $chosen): LayoutPartData
    {
        if ($this->tabs === []) {
            return LayoutPartData::build()->asBody()->key('body')->body(($this->body)())->finish();
        }

        return PublicationTab::setOf($this->tabs, $chosen);
    }
}
