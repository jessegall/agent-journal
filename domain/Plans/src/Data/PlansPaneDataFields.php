<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use App\Support\Layout\LayoutRowData;
use App\Web\Creation\Exceptions\MissingFields;

final class PlansPaneDataFields
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

    public function finish(): PlansPaneData
    {
        if (! isset($this->items)) {
            throw MissingFields::forType(PlansPaneData::class, 'items');
        }

        if (! isset($this->fullUrl)) {
            throw MissingFields::forType(PlansPaneData::class, 'fullUrl');
        }

        return new PlansPaneData(
            items: $this->items,
            fullUrl: $this->fullUrl,
        );
    }
}
