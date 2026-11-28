<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Exceptions\MissingFields;

final class ListEmptyFields
{
    private string $title;

    private string|null $detail = null;

    /** @var list<LayoutPartData> */
    private array $actions = [];

    private bool $fillsPage = false;

    private string $icon = 'info';

    public function title(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function detail(string|null $detail): self
    {
        $this->detail = $detail;

        return $this;
    }

    /** @param list<LayoutPartData> $actions */
    public function actions(array $actions): self
    {
        $this->actions = $actions;

        return $this;
    }

    public function fillsPage(bool $fillsPage): self
    {
        $this->fillsPage = $fillsPage;

        return $this;
    }

    public function icon(string $icon): self
    {
        $this->icon = $icon;

        return $this;
    }

    public function finish(): ListEmpty
    {
        if (! isset($this->title)) {
            throw MissingFields::forType(ListEmpty::class, 'title');
        }

        return new ListEmpty(
            title: $this->title,
            detail: $this->detail,
            actions: $this->actions,
            fillsPage: $this->fillsPage,
            icon: $this->icon,
        );
    }
}
