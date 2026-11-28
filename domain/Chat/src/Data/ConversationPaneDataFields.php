<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Support\Layout\LayoutRowData;
use App\Web\Creation\Exceptions\MissingFields;

final class ConversationPaneDataFields
{
    /** @var list<LayoutRowData> */
    private array $items;

    private string $fullUrl;

    private string $label;

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

    public function label(string $label): self
    {
        $this->label = $label;

        return $this;
    }

    public function finish(): ConversationPaneData
    {
        if (! isset($this->items)) {
            throw MissingFields::forType(ConversationPaneData::class, 'items');
        }

        if (! isset($this->fullUrl)) {
            throw MissingFields::forType(ConversationPaneData::class, 'fullUrl');
        }

        if (! isset($this->label)) {
            throw MissingFields::forType(ConversationPaneData::class, 'label');
        }

        return new ConversationPaneData(
            items: $this->items,
            fullUrl: $this->fullUrl,
            label: $this->label,
        );
    }
}
