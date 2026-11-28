<?php

declare(strict_types=1);

namespace App\Connections\Data;

use App\Projects\Enums\ProjectWindowStatus;
use App\Web\Creation\Exceptions\MissingFields;

final class ProjectPaneDataFields
{
    /** @var list<ProjectTreeEntryData> */
    private array $items;

    private string $fullUrl;

    private ProjectWindowStatus $status;

    private string $connectUrl;

    /** @param list<ProjectTreeEntryData> $items */
    public function items(array $items): self
    {
        $this->items = $items;

        return $this;
    }

    public function fullUrl(string $url): self
    {
        $this->fullUrl = $url;

        return $this;
    }

    public function status(ProjectWindowStatus $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function connectUrl(string $url): self
    {
        $this->connectUrl = $url;

        return $this;
    }

    public function finish(): ProjectPaneData
    {
        if (! isset($this->items)) {
            throw MissingFields::forType(ProjectPaneData::class, 'items');
        }

        if (! isset($this->fullUrl)) {
            throw MissingFields::forType(ProjectPaneData::class, 'fullUrl');
        }

        if (! isset($this->status)) {
            throw MissingFields::forType(ProjectPaneData::class, 'status');
        }

        if (! isset($this->connectUrl)) {
            throw MissingFields::forType(ProjectPaneData::class, 'connectUrl');
        }

        return new ProjectPaneData(
            items: $this->items,
            fullUrl: $this->fullUrl,
            status: $this->status,
            connectUrl: $this->connectUrl,
        );
    }
}
