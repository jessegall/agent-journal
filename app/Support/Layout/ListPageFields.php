<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Exceptions\LayoutRefused;
use App\Navigation\Layout\LayoutMenuData;
use App\Web\Creation\Exceptions\MissingFields;
use App\Web\Enums\ReaderWidth;

final class ListPageFields
{
    private string $title;

    private LayoutTableData $table;

    private ListEmpty $empty;

    private int|null $total = null;

    private bool $countRows = false;

    /** @var list<LayoutPartData> */
    private array $filters = [];

    /** @var list<LayoutTabData> */
    private array $tabs = [];

    /** @var list<LayoutRowData> */
    private array $views = [];

    private LayoutPartData|null $search = null;

    private LayoutPartData|null $creation = null;

    private ListPaging|null $paging = null;

    private LayoutBackData|null $back = null;

    private ReaderWidth $readerWidth = ReaderWidth::Standard;

    /** @var list<LayoutPartData> */
    private array $reader = [];

    public function title(string $title): self
    {
        return clone ($this, ['title' => $title]);
    }

    /**
     * @template TRecord
     * @param iterable<TRecord> $records
     * @param callable(TRecord): LayoutRowData $map
     */
    public function rows(iterable $records, callable $map): self
    {
        return clone ($this, ['table' => LayoutTableData::build()->rows($records, $map)->finish()]);
    }

    public function empty(ListEmpty $empty): self
    {
        return clone ($this, ['empty' => $empty]);
    }

    /**
     * Announces the total of the list; leave it out when the response supplies none.
     */
    public function counting(int $total): self
    {
        return clone ($this, ['total' => $total, 'countRows' => false]);
    }

    /**
     * Announces the total of a list that shows every row it has: the number of its rows.
     */
    public function countingRows(): self
    {
        return clone ($this, ['countRows' => true]);
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
        return clone ($this, ['search' => LayoutPartData::build()
            ->asField()
            ->key('search')
            ->label($label)
            ->field($field)
            ->finish()]);
    }

    /**
     * The creation the viewer may use, drawn at the end of the header.
     */
    public function creating(string $label, LayoutActionData $action): self
    {
        return clone ($this, ['creation' => LayoutPartData::build()
            ->asCreation()
            ->key('creation')
            ->label($label)
            ->action($action)
            ->finish()]);
    }

    /**
     * The creation the viewer may use when it opens a dialog: the dialog part, whose opener stands in the header; with
     * several, such as one for each kind of record, they stand side by side.
     */
    public function creatingWith(LayoutPartData ...$creations): self
    {
        return clone ($this, ['creation' => count($creations) === 1
            ? $creations[0]
            : LayoutPartData::build()->asBox()->key('creation')->style('row')->children(...$creations)->finish()]);
    }

    /**
     * The creation the viewer may use when it is a menu, such as plain and guided entry.
     */
    public function creatingFromMenu(LayoutMenuData $menu): self
    {
        return clone ($this, ['creation' => LayoutPartData::build()
            ->asMenu()
            ->key('creation')
            ->menu($menu)
            ->finish()]);
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

    public function finish(): DeclaredLayoutData
    {
        if (! isset($this->title, $this->table, $this->empty)) {
            throw MissingFields::forType(ListPage::class, 'title', 'rows', 'empty');
        }

        if ($this->paging?->isCursor && count($this->table->rows) > LayoutPartData::ROW_LIMIT) {
            throw LayoutRefused::tooManyRows('rows', count($this->table->rows), LayoutPartData::ROW_LIMIT);
        }

        if ($this->table->rows === [] && $this->reader === [] && $this->empty->fillsPage && ! $this->paging?->isAppend) {
            return DeclaredLayoutData::build()
                ->root(
                    LayoutPartData::build()
                    ->asBox()
                    ->key('index')
                    ->style('page')
                    ->children($this->header(), $this->empty->page())
                    ->finish(),
                )
                ->finish();
        }

        $parts = [
            ...$this->filters,
            $this->content(),
        ];

        if (! $this->back instanceof LayoutBackData) {
            return DeclaredLayoutData::build()
                ->root(
                    LayoutPartData::build()
                    ->asBox()
                    ->key('list')
                    ->style('page')
                    ->children($this->header(), ...$parts)
                    ->finish(),
                )
                ->finish();
        }

        $split = $this->reader === []
            ? LayoutSplitData::build()->asShowingList()->readerWidth($this->readerWidth)->finish()
            : LayoutSplitData::build()
                ->asShowingReader()
                ->back($this->back)
                ->readerWidth($this->readerWidth)
                ->finish();

        return DeclaredLayoutData::build()
            ->root(
                LayoutPartData::build()
                ->asBox()
                ->key('index')
                ->style('page')
                ->children(
                    $this->header(),
                    LayoutPartData::build()
                    ->asSplit()
                    ->key('split')
                    ->split($split)
                    ->list(
                        LayoutPartData::build()
                        ->asBox()
                        ->key('list')
                        ->style('page-list')
                        ->children(...$parts)
                        ->finish(),
                    )
                    ->reader(...$this->readerParts())
                    ->finish(),
                )
                ->finish(),
            )
            ->finish();
    }

    private function header(): LayoutPartData
    {
        $parts = [LayoutPartData::build()
            ->asText()
            ->key('title')
            ->value($this->title)
            ->style('heading')
            ->finish()];

        $total = $this->countRows ? count($this->table->rows) : $this->total;

        if ($total !== null) {
            $parts[] = LayoutPartData::build()
                ->asText()
                ->key('count')
                ->value((string) $total)
                ->style('muted')
                ->finish();
        }

        if ($this->views !== []) {
            $parts[] = LayoutPartData::build()
                ->asCollection()
                ->key('views')
                ->style('choices')
                ->rows($this->views)
                ->finish();
        }

        foreach ([
            $this->search,
            $this->creation,
        ] as $part) {
            if ($part instanceof LayoutPartData) {
                $parts[] = $part;
            }
        }

        return LayoutPartData::build()->asBox()->key('header')->style('page-head')->children(...$parts)->finish();
    }

    private function content(): LayoutPartData
    {
        $shown = LayoutPartData::build()
            ->asBox()
            ->key('content')
            ->style('stack')
            ->children(...$this->shownParts())
            ->finish();

        if ($this->tabs === []) {
            return $shown;
        }

        return LayoutPartData::build()->asTabs()->key('tabs')->tabs($this->tabs)->shown($shown)->finish();
    }

    /**
     * @return list<LayoutPartData>
     */
    private function shownParts(): array
    {
        if ($this->table->rows === []) {
            if ($this->paging?->isAppend) {
                return [LayoutPartData::build()->asCollection()->key('rows')->style('list')->rows([])->finish()];
            }

            return $this->empty->parts();
        }

        $parts = $this->table->parts();

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
        if ($this->reader !== [] || $this->table->rows === []) {
            return $this->reader;
        }

        return [LayoutPartData::build()
            ->asNotice()
            ->key('nothing-selected')
            ->style('empty')
            ->title('Nothing selected')
            ->finish()];
    }
}
