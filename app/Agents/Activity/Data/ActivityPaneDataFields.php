<?php

declare(strict_types=1);

namespace App\Agents\Activity\Data;

use App\Support\Layout\LayoutRowData;
use App\Web\Creation\Exceptions\MissingFields;

final class ActivityPaneDataFields
{
    /** @var list<LayoutRowData> */
    private array $items;

    private string $fullUrl;

    /** @param list<LayoutRowData> $items */
    public function items(array $items): self
    {
        $this->items = $items;

        return $this;
    }

    public function fullUrl(string $fullUrl): self
    {
        $this->fullUrl = $fullUrl;

        return $this;
    }

    public function finish(): ActivityPaneData
    {
        if (! isset($this->items)) {
            throw MissingFields::forType(ActivityPaneData::class, 'items');
        }

        if (! isset($this->fullUrl)) {
            throw MissingFields::forType(ActivityPaneData::class, 'fullUrl');
        }

        return new ActivityPaneData(
            items: $this->items,
            fullUrl: $this->fullUrl,
        );
    }
}
