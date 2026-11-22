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
    private function __construct(
        public int $page,
        public int $lastPage,
        public string|null $after,
    ) {}

    public static function numbered(int $page, int $lastPage): self
    {
        return new self($page, $lastPage, null);
    }

    /**
     * The paging of a cursor list: the id the next rows start after, or none when the rows shown are the last.
     */
    public static function cursor(string|null $after): self
    {
        return new self(1, 1, $after);
    }

    /**
     * @return list<LayoutPartData>
     */
    public function parts(): array
    {
        if ($this->after !== null) {
            $more = LayoutActionData::appending(['after' => $this->after]);

            return [LayoutPartData::action('more', 'Show more', $more)];
        }

        if ($this->lastPage <= 1) {
            return [];
        }

        return [
            LayoutPartData::box(
                'paging',
                'row',
                $this->control('first', 'First', 1, 'You are on the first page.'),
                $this->control('previous', 'Previous', $this->page - 1, 'You are on the first page.'),
                LayoutPartData::text('position', "Page {$this->page} of {$this->lastPage}", 'muted'),
                $this->control('next', 'Next', $this->page + 1, 'You are on the last page.'),
                $this->control('last', 'Last', $this->lastPage, 'You are on the last page.'),
            ),
        ];
    }

    private function control(string $key, string $label, int $target, string $reason): LayoutPartData
    {
        $isOutside = $target < 1 || $target > $this->lastPage || $target === $this->page;

        $action = $isOutside
            ? LayoutActionData::unavailable($reason)
            : LayoutActionData::changing(['page' => (string) $target]);

        return LayoutPartData::action($key, $label, $action);
    }
}
