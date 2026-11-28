<?php

declare(strict_types=1);

namespace App\Support\Layout;

/**
 * How a list is paged, matching what its response supplies: a numbered list takes the page and the last page, and
 * draws first, previous, next and last with the end controls disabled; a cursor list draws one Show more
 * that appends the rows after the last one shown.
 */
final readonly class ListPaging
{
    /** @use \App\Web\Creation\Buildable<ListPagingFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = ListPagingFields::class;

    public function __construct(
        public int $page,
        public int $lastPage,
        public string|null $after,
        public bool $isAppend = false,
        public bool $isCursor = false,
    ) {}

    /**
     * @return list<LayoutPartData>
     */
    public function parts(): array
    {
        if ($this->after !== null) {
            $more = LayoutActionData::build()->query(['after' => $this->after])->appends(true)->finish();

            return [LayoutPartData::build()
                ->asAction()
                ->key('more')
                ->label('Show more')
                ->action($more)
                ->finish()];
        }

        if ($this->lastPage <= 1) {
            return [];
        }

        return [
            LayoutPartData::build()
                ->asBox()
                ->key('paging')
                ->style('row')
                ->children(
                    $this->control('first', 'First', 1, 'You are on the first page.'),
                    $this->control('previous', 'Previous', $this->page - 1, 'You are on the first page.'),
                    LayoutPartData::build()
                    ->asText()
                    ->key('position')
                    ->value("Page {$this->page} of {$this->lastPage}")
                    ->style('muted')
                    ->finish(),
                    $this->control('next', 'Next', $this->page + 1, 'You are on the last page.'),
                    $this->control('last', 'Last', $this->lastPage, 'You are on the last page.'),
                )
                ->finish(),
        ];
    }

    private function control(string $key, string $label, int $target, string $reason): LayoutPartData
    {
        $isOutside = $target < 1 || $target > $this->lastPage || $target === $this->page;

        $action = $isOutside
            ? LayoutActionData::build()->reason($reason)->finish()
            : LayoutActionData::build()->query(['page' => (string) $target])->finish();

        return LayoutPartData::build()->asAction()->key($key)->label($label)->action($action)->finish();
    }
}
