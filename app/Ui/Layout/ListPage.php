<?php

declare(strict_types=1);

namespace App\Ui\Layout;

use App\Ui\Enums\ReaderWidth;

/**
 * The shared recipe of an index page: its header with the title, the count when the response supplies a total, the
 * views beside them and the search and creation at the other edge, then its filters, optional tabs, the rows or the
 * empty state, and the paging. With a reader the header stands above a split that shows the list or the reader in a
 * narrow container by its address, and a populated index with nothing chosen shows Nothing selected there. A domain
 * hands in neutral rows and parts only.
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

    /**
     * @var list<LayoutRowData>
     */
    private array $views = [];

    private LayoutPartData|null $search = null;

    private LayoutPartData|null $creation = null;

    private ListPaging|null $paging = null;

    private LayoutBackData|null $back = null;

    private ReaderWidth $readerWidth = ReaderWidth::Standard;

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
     * The views of the same records, such as List and Graph, as choices beside the title; each sets the window's query.
     */
    public function withViews(LayoutRowData ...$views): self
    {
        $this->views = array_values($views);

        return $this;
    }

    /**
     * A search field at the end of the header, writing the window's query.
     */
    public function searching(string $label, LayoutFieldData $field): self
    {
        $this->search = LayoutPartData::field('search', $label, $field);

        return $this;
    }

    /**
     * The creation the viewer may use, drawn at the end of the header.
     */
    public function creating(string $label, LayoutActionData $action): self
    {
        $this->creation = LayoutPartData::action('creation', $label, $action, 'primary');

        return $this;
    }

    /**
     * The creation the viewer may use when it opens a dialog: the dialog part, whose opener stands in the header.
     */
    public function creatingWith(LayoutPartData $creation): self
    {
        $this->creation = $creation;

        return $this;
    }

    /**
     * The creation the viewer may use when it is a menu, such as plain and guided entry.
     */
    public function creatingFromMenu(LayoutMenuData $menu): self
    {
        $this->creation = LayoutPartData::menu('creation', $menu);

        return $this;
    }

    public function paged(ListPaging $paging): self
    {
        $this->paging = $paging;

        return $this;
    }

    /**
     * Splits the page into the index and its reader. An address that names a record gives its parts, shown alone in a
     * narrow container with Back to the list; an index address gives none, shows the list, and has Nothing selected.
     */
    public function withReader(LayoutBackData $back, LayoutPartData ...$parts): self
    {
        $this->back = $back;
        $this->reader = array_values($parts);

        return $this;
    }

    public function withReaderWidth(ReaderWidth $width): self
    {
        $this->readerWidth = $width;

        return $this;
    }

    public function layout(): DeclaredLayoutData
    {
        $parts = [...$this->filters, $this->content()];

        if (! $this->back instanceof LayoutBackData) {
            return DeclaredLayoutData::of(LayoutPartData::box('list', 'stack', $this->header(), ...$parts));
        }

        $split = $this->reader === []
            ? LayoutSplitData::showingList($this->readerWidth)
            : LayoutSplitData::showingReader($this->back, $this->readerWidth);

        return DeclaredLayoutData::of(LayoutPartData::box(
            'index',
            'stack',
            $this->header(),
            LayoutPartData::split(
                'split',
                $split,
                LayoutPartData::box('list', 'stack', ...$parts),
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

        foreach ([$this->search, $this->creation] as $part) {
            if ($part instanceof LayoutPartData) {
                $parts[] = $part;
            }
        }

        return LayoutPartData::box('header', 'bar', ...$parts);
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
