<?php

declare(strict_types=1);

namespace App\Ui\Layout;

/**
 * The shared recipe of an index page: its header with the title, the count when the response supplies a total and an
 * optional creation, then its filters, optional tabs, the rows or the empty state, and the paging; with a reader it
 * is split, and a populated index with nothing chosen shows Nothing selected there. A domain hands in neutral rows
 * and parts only.
 */
final class ListPage
{
    private int|null $total = null;

    /**
     * @var list<LayoutPartData>
     */
    private array $filters = [];

    /**
     * @var list<LayoutTabData>
     */
    private array $tabs = [];

    private LayoutPartData|null $creation = null;

    private ListPaging|null $paging = null;

    private bool $hasReader = false;

    /**
     * @var list<LayoutPartData>
     */
    private array $reader = [];

    /**
     * @param  list<LayoutRowData>  $rows
     */
    private function __construct(
        private readonly string $title,
        private readonly array $rows,
        private readonly ListEmpty $empty,
    ) {}

    /**
     * @param  list<LayoutRowData>  $rows
     */
    public static function make(string $title, array $rows, ListEmpty $empty): self
    {
        return new self($title, $rows, $empty);
    }

    /**
     * Announces the total of the list; leave it out when the response supplies none.
     */
    public function counting(int $total): self
    {
        $this->total = $total;

        return $this;
    }

    public function filteredBy(LayoutPartData ...$filters): self
    {
        $this->filters = array_values($filters);

        return $this;
    }

    /**
     * The tabs above the rows; the rows handed in are those of the chosen tab.
     */
    public function withTabs(LayoutTabData ...$tabs): self
    {
        $this->tabs = array_values($tabs);

        return $this;
    }

    /**
     * The creation the viewer may use, an action or a menu, drawn at the end of the header.
     */
    public function creating(LayoutPartData $creation): self
    {
        $this->creation = $creation;

        return $this;
    }

    public function paged(ListPaging $paging): self
    {
        $this->paging = $paging;

        return $this;
    }

    /**
     * Splits the page into the index and its reader; with no part, nothing is selected.
     */
    public function withReader(LayoutPartData ...$parts): self
    {
        $this->hasReader = true;
        $this->reader = array_values($parts);

        return $this;
    }

    public function layout(): DeclaredLayoutData
    {
        $list = LayoutPartData::box('list', 'stack', $this->header(), ...[...$this->filters, $this->content()]);

        if (! $this->hasReader) {
            return DeclaredLayoutData::of($list);
        }

        return DeclaredLayoutData::of(LayoutPartData::box('index', 'split', $list, ...$this->readerParts()));
    }

    private function header(): LayoutPartData
    {
        $parts = [LayoutPartData::text('title', $this->title, 'heading')];

        if ($this->total !== null) {
            $parts[] = LayoutPartData::text('count', (string) $this->total, 'muted');
        }

        if ($this->creation instanceof LayoutPartData) {
            $parts[] = $this->creation;
        }

        return LayoutPartData::box('header', 'header', ...$parts);
    }

    private function content(): LayoutPartData
    {
        $shown = LayoutPartData::box('content', 'stack', ...$this->shownParts());

        if ($this->tabs === []) {
            return $shown;
        }

        return LayoutPartData::tabs('tabs', $this->tabs, $shown);
    }

    /**
     * @return list<LayoutPartData>
     */
    private function shownParts(): array
    {
        if ($this->rows === []) {
            return $this->empty->parts();
        }

        return [
            LayoutPartData::collection('rows', 'list', $this->rows),
            ...($this->paging instanceof ListPaging ? $this->paging->parts() : []),
        ];
    }

    /**
     * @return list<LayoutPartData>
     */
    private function readerParts(): array
    {
        if ($this->reader !== [] || $this->rows === []) {
            return $this->reader;
        }

        return [LayoutPartData::notice('nothing-selected', 'empty', 'Nothing selected')];
    }
}
