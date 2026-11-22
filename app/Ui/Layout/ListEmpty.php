<?php

declare(strict_types=1);

namespace App\Ui\Layout;

/**
 * What a list says when it holds no row: an informational empty state, with the action that starts a record or clears
 * the filter when there is one to offer.
 */
final readonly class ListEmpty
{
    /**
     * @param  list<LayoutPartData>  $actions
     */
    private function __construct(
        public string $title,
        public string|null $detail,
        public array $actions,
    ) {}

    /**
     * An empty state with nothing to offer, such as a list the viewer may not add to.
     */
    public static function informing(string $title, string|null $detail = null): self
    {
        return new self($title, $detail, []);
    }

    /**
     * An empty state with its action: the permitted creation of a list read empty, or the clear action of a list its
     * filter emptied.
     */
    public static function offering(string $title, LayoutPartData $action, string|null $detail = null): self
    {
        return new self($title, $detail, [$action]);
    }

    /**
     * @return list<LayoutPartData>
     */
    public function parts(): array
    {
        $notice = LayoutPartData::notice('empty', 'empty', $this->title, $this->detail);

        if ($this->actions === []) {
            return [$notice];
        }

        return [$notice, LayoutPartData::box('empty-actions', 'row', ...$this->actions)];
    }
}
