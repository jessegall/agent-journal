<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Exceptions\MissingFields;

final class DetailPageFields
{
    private string $title;

    /** @var list<LayoutPartData> */
    private array $metadata = [];

    private string|null $abstract = null;

    /** @var list<LayoutPartData> */
    private array $actions = [];

    /** @var list<LayoutRowData> */
    private array $facts = [];

    /** @var list<LayoutPartData> */
    private array $standing = [];

    /** @var list<PublicationTab> */
    private array $tabs = [];

    public function title(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    /** @param list<LayoutPartData> $metadata */
    public function metadata(array $metadata): self
    {
        $this->metadata = $metadata;

        return $this;
    }

    public function abstract(string|null $abstract): self
    {
        $this->abstract = $abstract;

        return $this;
    }

    /** @param list<LayoutPartData> $actions */
    public function actions(array $actions): self
    {
        $this->actions = $actions;

        return $this;
    }

    /** @param list<LayoutRowData> $facts */
    public function facts(array $facts): self
    {
        $this->facts = $facts;

        return $this;
    }

    /** @param list<LayoutPartData> $standing */
    public function standing(array $standing): self
    {
        $this->standing = $standing;

        return $this;
    }

    /** @param list<PublicationTab> $tabs */
    public function tabs(array $tabs): self
    {
        $this->tabs = $tabs;

        return $this;
    }

    public function finish(): DetailPage
    {
        if (! isset($this->title)) {
            throw MissingFields::forType(DetailPage::class, 'title');
        }

        return new DetailPage(
            title: $this->title,
            metadata: $this->metadata,
            abstract: $this->abstract,
            actions: $this->actions,
            facts: $this->facts,
            standing: $this->standing,
            tabs: $this->tabs,
        );
    }
}
