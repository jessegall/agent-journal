<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Navigation\Layout\LayoutMenuData;
use App\Web\Enums\ReaderWidth;

/**
 * The shared recipe of an index page: its header with the title, count, views, search and creation, then its filters,
 * tabs, rows or empty state, and paging. With a reader, a split shows the list or the reader by its address, and
 * Nothing selected while nothing is chosen.
 */
final readonly class ListPage
{
    /**
     * @param  list<LayoutRowData>  $rows
     * @param  list<LayoutPartData>  $filters
     * @param  list<LayoutTabData>  $tabs
     * @param  list<LayoutRowData>  $views
     * @param  list<LayoutPartData>  $reader
     */
    private function __construct(
        public string $title,
        public array $rows,
        public ListEmpty $empty,
        public int|null $total = null,
        public array $filters = [],
        public array $tabs = [],
        public array $views = [],
        public LayoutPartData|null $search = null,
        public LayoutPartData|null $creation = null,
        public ListPaging|null $paging = null,
        public LayoutBackData|null $back = null,
        public ReaderWidth $readerWidth = ReaderWidth::Standard,
        public array $reader = [],
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
        return clone ($this, ['total' => $total]);
    }

    /**
     * Announces the total of a list that shows every row it has: the number of its rows.
     */
    public function countingRows(): self
    {
        return $this->counting(count($this->rows));
    }

    public function filteredBy(LayoutPartData ...$filters): self
    {
        return clone ($this, ['filters' => array_values($filters)]);
    }

    /**
     * The tabs above the rows; the rows handed in are those of the chosen tab.
     */
    public function withTabs(LayoutTabData ...$tabs): self
    {
        return clone ($this, ['tabs' => array_values($tabs)]);
    }

    /**
     * The views of the same records, such as List and Graph, as choices beside the title; each sets the window's query.
     */
    public function withViews(LayoutRowData ...$views): self
    {
        return clone ($this, ['views' => array_values($views)]);
    }

    /**
     * A search field at the end of the header, writing the window's query.
     */
    public function searching(string $label, LayoutFieldData $field): self
    {
        return clone ($this, ['search' => LayoutPartData::field('search', $label, $field)]);
    }

    /**
     * The creation the viewer may use, drawn at the end of the header.
     */
    public function creating(string $label, LayoutActionData $action): self
    {
        return clone ($this, ['creation' => LayoutPartData::creation('creation', $label, $action)]);
    }

    /**
     * The creation the viewer may use when it opens a dialog: the dialog part, whose opener stands in the header; with
     * several, such as one for each kind of record, they stand side by side.
     */
    public function creatingWith(LayoutPartData ...$creations): self
    {
        return clone ($this, ['creation' => count($creations) === 1
            ? $creations[0]
            : LayoutPartData::box('creation', 'row', ...$creations)]);
    }

    /**
     * The creation the viewer may use when it is a menu, such as plain and guided entry.
     */
    public function creatingFromMenu(LayoutMenuData $menu): self
    {
        return clone ($this, ['creation' => LayoutPartData::menu('creation', $menu)]);
    }

    public function paged(ListPaging $paging): self
    {
        return clone ($this, ['paging' => $paging]);
    }

    /**
     * Splits the page into the index and its reader. An address that names a record gives its parts, shown alone in a
     * narrow container with Back to the list; an index address gives none, shows the list, and has Nothing selected.
     */
    public function withReader(LayoutBackData $back, LayoutPartData ...$parts): self
    {
        return clone ($this, ['back' => $back, 'reader' => array_values($parts)]);
    }

    public function withReaderWidth(ReaderWidth $width): self
    {
        return clone ($this, ['readerWidth' => $width]);
    }

    public function layout(): DeclaredLayoutData
    {
        if ($this->rows === [] && $this->reader === [] && $this->empty->fillsPage) {
            return DeclaredLayoutData::of(LayoutPartData::box('index', 'page', $this->header(), $this->empty->page()));
        }

        $parts = [
            ...$this->filters,
            $this->content(),
        ];

        if (! $this->back instanceof LayoutBackData) {
            return DeclaredLayoutData::of(LayoutPartData::box('list', 'page', $this->header(), ...$parts));
        }

        $split = $this->reader === []
            ? LayoutSplitData::showingList($this->readerWidth)
            : LayoutSplitData::showingReader($this->back, $this->readerWidth);

        return DeclaredLayoutData::of(LayoutPartData::box(
            'index',
            'page',
            $this->header(),
            LayoutPartData::split(
                'split',
                $split,
                LayoutPartData::box('list', 'page-list', ...$parts),
                ...$this->readerParts(),
            ),
        ));
    }

    private function header(): LayoutPartData
    {
        $parts = [LayoutPartData::text('title', $this->title, 'heading')];

        if ($this->total !== null) {
            $parts[] = LayoutPartData::text('count', (string) $this->total, 'muted');
        }

        if ($this->views !== []) {
            $parts[] = LayoutPartData::collection('views', 'choices', $this->views);
        }

        foreach ([
            $this->search,
            $this->creation,
        ] as $part) {
            if ($part instanceof LayoutPartData) {
                $parts[] = $part;
            }
        }

        return LayoutPartData::box('header', 'page-head', ...$parts);
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

        $parts = [LayoutPartData::collection('rows', 'list', $this->rows)];

        if ($this->paging instanceof ListPaging) {
            $parts = [
                ...$parts,
                ...$this->paging->parts(),
            ];
        }

        return $parts;
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
