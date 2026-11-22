<?php

declare(strict_types=1);

namespace App\Ui\Layout;

/**
 * The shared recipe of a record's reader: a metadata line above its title, the title, an abstract, its actions, its
 * facts with the links their values carry, parts that stay on every tab such as native ones, and its tabs, of which
 * only the chosen one is read. A record that was removed is a notice with Back to its list. A domain hands in neutral
 * values and readers only.
 */
final class DetailPage
{
    /**
     * @var list<LayoutPartData>
     */
    private array $metadata = [];

    private string|null $abstract = null;

    /**
     * @var list<LayoutPartData>
     */
    private array $actions = [];

    /**
     * @var list<LayoutRowData>
     */
    private array $facts = [];

    /**
     * @var list<LayoutPartData>
     */
    private array $standing = [];

    /**
     * @var list<PublicationTab>
     */
    private array $tabs = [];

    private function __construct(private readonly string $title) {}

    public static function make(string $title): self
    {
        return new self($title);
    }

    /**
     * The line above the title, such as the link to the plan a task belongs to.
     */
    public function above(LayoutPartData ...$metadata): self
    {
        $this->metadata = array_values($metadata);

        return $this;
    }

    public function summarising(string $abstract): self
    {
        $this->abstract = $abstract;

        return $this;
    }

    /**
     * The actions beside the title: action and menu parts.
     */
    public function withActions(LayoutPartData ...$actions): self
    {
        $this->actions = array_values($actions);

        return $this;
    }

    /**
     * The facts of the record, each a label and a value that may be pieces with their own links.
     */
    public function withFacts(LayoutRowData ...$facts): self
    {
        $this->facts = array_values($facts);

        return $this;
    }

    /**
     * Parts shown under the facts on every tab, such as native parts with their serializable props.
     */
    public function withStanding(LayoutPartData ...$parts): self
    {
        $this->standing = array_values($parts);

        return $this;
    }

    public function withTabs(PublicationTab ...$tabs): self
    {
        $this->tabs = array_values($tabs);

        return $this;
    }

    /**
     * The page as a layout, showing the tab the window's query chose, or the first when it chose none it has.
     */
    public function layout(string $chosen = ''): DeclaredLayoutData
    {
        return DeclaredLayoutData::of(
            LayoutPartData::box('detail', 'reader', ...[...$this->head(), ...$this->body($chosen)]),
        );
    }

    /**
     * The notice of a record that was removed, with Back to the list that owned it.
     */
    public static function removed(string $noun, LayoutBackData $back): DeclaredLayoutData
    {
        return DeclaredLayoutData::of(LayoutPartData::box(
            'removed',
            'stack',
            LayoutPartData::notice('removed', 'empty', "This {$noun} was removed."),
            LayoutPartData::action('back', $back->label, LayoutActionData::to($back->href)),
        ));
    }

    /**
     * @return list<LayoutPartData>
     */
    private function head(): array
    {
        $parts = [LayoutPartData::text('title', $this->title, 'heading')];

        if ($this->metadata !== []) {
            $parts[] = LayoutPartData::box('metadata', 'row', ...$this->metadata);
        }

        if ($this->abstract !== null) {
            $parts[] = LayoutPartData::text('abstract', $this->abstract, 'muted');
        }

        if ($this->actions !== []) {
            $parts[] = LayoutPartData::box('actions', 'row', ...$this->actions);
        }

        return $parts;
    }

    /**
     * @return list<LayoutPartData>
     */
    private function body(string $chosen): array
    {
        return [
            ...($this->facts === [] ? [] : [LayoutPartData::collection('facts', 'facts', $this->facts)]),
            ...$this->standing,
            ...($this->tabs === [] ? [] : [PublicationTab::setOf($this->tabs, $chosen)]),
        ];
    }
}
