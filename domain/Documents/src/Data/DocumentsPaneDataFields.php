<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use App\Support\Layout\LayoutRowData;
use App\Web\Creation\Exceptions\MissingFields;

final class DocumentsPaneDataFields
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

    public function fullUrl(string $url): self
    {
        $this->fullUrl = $url;

        return $this;
    }

    public function finish(): DocumentsPaneData
    {
        if (! isset($this->items)) {
            throw MissingFields::forType(DocumentsPaneData::class, 'items');
        }

        if (! isset($this->fullUrl)) {
            throw MissingFields::forType(DocumentsPaneData::class, 'fullUrl');
        }

        return new DocumentsPaneData(
            items: $this->items,
            fullUrl: $this->fullUrl,
        );
    }
}
