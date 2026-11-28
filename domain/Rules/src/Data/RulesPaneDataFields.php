<?php

declare(strict_types=1);

namespace Domain\Rules\Data;

use App\Support\Layout\LayoutRowData;
use App\Web\Creation\Exceptions\MissingFields;

final class RulesPaneDataFields
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

    public function finish(): RulesPaneData
    {
        if (! isset($this->items)) {
            throw MissingFields::forType(RulesPaneData::class, 'items');
        }

        if (! isset($this->fullUrl)) {
            throw MissingFields::forType(RulesPaneData::class, 'fullUrl');
        }

        return new RulesPaneData(
            items: $this->items,
            fullUrl: $this->fullUrl,
        );
    }
}
