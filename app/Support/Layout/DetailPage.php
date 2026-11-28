<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Buildable;

/**
 * The shared recipe of a record's reader: a metadata line, the title, an abstract, its actions, its facts with their
 * links, parts on every tab, and its tabs, of which only the chosen one is read. A removed record is a notice with Back
 * to its list.
 */
final readonly class DetailPage
{
    /** @use Buildable<DetailPageFields> */
    use Buildable;

    protected const string FIELDS = DetailPageFields::class;

    /**
     * @param  list<LayoutPartData>  $metadata
     * @param  list<LayoutPartData>  $actions
     * @param  list<LayoutRowData>  $facts
     * @param  list<LayoutPartData>  $standing
     * @param  list<PublicationTab>  $tabs
     */
    public function __construct(
        public string $title,
        public array $metadata = [],
        public string|null $abstract = null,
        public array $actions = [],
        public array $facts = [],
        public array $standing = [],
        public array $tabs = [],
    ) {}

    /**
     * The line above the title, such as the link to the plan a task belongs to.
     */
    public function above(LayoutPartData ...$metadata): self
    {
        return clone ($this, ['metadata' => array_values($metadata)]);
    }

    public function summarising(string $abstract): self
    {
        return clone ($this, ['abstract' => $abstract]);
    }

    /**
     * The actions beside the title: action and menu parts.
     */
    public function withActions(LayoutPartData ...$actions): self
    {
        return clone ($this, ['actions' => array_values($actions)]);
    }

    /**
     * The facts of the record, each a label and a value that may be pieces with their own links.
     */
    public function withFacts(LayoutRowData ...$facts): self
    {
        return clone ($this, ['facts' => array_values($facts)]);
    }

    /**
     * Parts shown under the facts on every tab, such as native parts with their serializable props.
     */
    public function withStanding(LayoutPartData ...$parts): self
    {
        return clone ($this, ['standing' => array_values($parts)]);
    }

    public function withTabs(PublicationTab ...$tabs): self
    {
        return clone ($this, ['tabs' => array_values($tabs)]);
    }

    /**
     * The page as a layout, showing the tab the window's query chose, or the first when it chose none it has.
     */
    public function layout(string $chosen = ''): DeclaredLayoutData
    {
        return DeclaredLayoutData::build()->root($this->part($chosen))->finish();
    }

    /**
     * The page as one part, to stand in the reader of a split beside its list.
     */
    public function part(string $chosen = ''): LayoutPartData
    {
        return LayoutPartData::build()
            ->asBox()
            ->key('detail')
            ->style('reader')
            ->children(...[...$this->head(), ...$this->body($chosen)])
            ->finish();
    }

    /**
     * The notice of a record that was removed, with Back to the list that owned it.
     */
    public static function removed(string $noun, LayoutBackData $back): DeclaredLayoutData
    {
        return DeclaredLayoutData::build()
            ->root(
                LayoutPartData::build()
                    ->asBox()
                    ->key('removed')
                    ->style('stack')
                    ->children(
                        LayoutPartData::build()
                            ->asNotice()
                            ->key('removed')
                            ->style('empty')
                            ->title("This {$noun} was removed.")
                            ->finish(),
                        LayoutPartData::build()
                            ->asAction()
                            ->key('back')
                            ->label($back->label)
                            ->action(LayoutActionData::build()->href($back->href)->finish())
                            ->finish(),
                    )
                    ->finish(),
            )
            ->finish();
    }

    /**
     * @return list<LayoutPartData>
     */
    private function head(): array
    {
        $parts = [LayoutPartData::build()
            ->asText()
            ->key('title')
            ->value($this->title)
            ->style('heading')
            ->finish()];

        if ($this->metadata !== []) {
            $parts[] = LayoutPartData::build()
                ->asBox()
                ->key('metadata')
                ->style('row')
                ->children(...$this->metadata)
                ->finish();
        }

        if ($this->abstract !== null) {
            $parts[] = LayoutPartData::build()
                ->asText()
                ->key('abstract')
                ->value($this->abstract)
                ->style('muted')
                ->finish();
        }

        if ($this->actions !== []) {
            $parts[] = LayoutPartData::build()
                ->asBox()
                ->key('actions')
                ->style('row')
                ->children(...$this->actions)
                ->finish();
        }

        return $parts;
    }

    /**
     * @return list<LayoutPartData>
     */
    private function body(string $chosen): array
    {
        $parts = [];

        if ($this->facts !== []) {
            $parts[] = LayoutPartData::build()
                ->asCollection()
                ->key('facts')
                ->style('facts')
                ->rows($this->facts)
                ->finish();
        }

        $parts = [
            ...$parts,
            ...$this->standing,
        ];

        if ($this->tabs !== []) {
            $parts[] = PublicationTab::setOf($this->tabs, $chosen);
        }

        return $parts;
    }
}
