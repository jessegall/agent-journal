<?php

declare(strict_types=1);

namespace App\Support\Layout;

/**
 * What a list says when it holds no row: an informational empty state, with the action that starts a record or clears
 * the filter when there is one to offer. A list that holds nothing yet fills the whole page under its header with its
 * subject's icon, its title, one sentence on what the thing is for and the action that makes the first one.
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
        public bool $fillsPage = false,
        public string $icon = 'info',
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
     * The page has no row at all yet: it shows no list and no reader, only this, centred under the header.
     */
    public static function nothingYet(string $title, string $detail, string $icon, LayoutPartData ...$actions): self
    {
        return new self($title, $detail, array_values($actions), true, $icon);
    }

    /**
     * The empty state that stands in place of the list and its reader.
     */
    public function page(): LayoutPartData
    {
        return LayoutPartData::box(
            'empty-page',
            'page-empty',
            LayoutPartData::text('icon', $this->icon, 'icon'),
            LayoutPartData::notice('empty', 'first', $this->title, $this->detail),
            ...$this->actions,
        );
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
