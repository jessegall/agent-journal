<?php

declare(strict_types=1);

namespace App\Support\Layout;

/**
 * What a list shows when it holds no row: an empty state with the action that starts a record or clears the filter. A
 * list that holds nothing yet fills the page with its subject's icon, title, one sentence on what the subject is for
 * and the action that makes the first one.
 */
final readonly class EmptyListState
{
    /** @use \App\Web\Creation\Buildable<EmptyListStateFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = EmptyListStateFields::class;

    /**
     * @param  list<LayoutPartData>  $actions
     */
    public function __construct(
        public string $title,
        public string|null $detail,
        public array $actions,
        public bool $fillsPage = false,
        public string $icon = 'info',
    ) {}

    /**
     * The empty state that stands in place of the list and its reader.
     */
    public function page(): LayoutPartData
    {
        return LayoutPartData::build()
            ->asBox()
            ->key('empty-page')
            ->style('page-empty')
            ->children(
                LayoutPartData::build()->asText()->key('icon')->value($this->icon)->style('icon')->finish(),
                LayoutPartData::build()
                ->asNotice()
                ->key('empty')
                ->style('first')
                ->title($this->title)
                ->detail($this->detail)
                ->finish(),
                ...$this->actions,
            )
            ->finish();
    }

    /**
     * @return list<LayoutPartData>
     */
    public function parts(): array
    {
        $notice = LayoutPartData::build()
            ->asNotice()
            ->key('empty')
            ->style('empty')
            ->title($this->title)
            ->detail($this->detail)
            ->finish();

        if ($this->actions === []) {
            return [$notice];
        }

        return [
            $notice,
            LayoutPartData::build()
                ->asBox()
                ->key('empty-actions')
                ->style('row')
                ->children(...$this->actions)
                ->finish(),
        ];
    }
}
