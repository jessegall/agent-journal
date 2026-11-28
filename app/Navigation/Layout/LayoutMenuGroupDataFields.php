<?php

declare(strict_types=1);

namespace App\Navigation\Layout;

use App\Web\Creation\Exceptions\MissingFields;

final class LayoutMenuGroupDataFields
{
    private string $key;

    /** @var list<LayoutMenuItemData> */
    private array $items;

    public function key(string $key): self
    {
        $this->key = $key;

        return $this;
    }

    /** @param list<LayoutMenuItemData> $items */
    public function items(array $items): self
    {
        $this->items = $items;

        return $this;
    }

    public function finish(): LayoutMenuGroupData
    {
        if (! isset($this->key)) {
            throw MissingFields::forType(LayoutMenuGroupData::class, 'key');
        }

        if (! isset($this->items)) {
            throw MissingFields::forType(LayoutMenuGroupData::class, 'items');
        }

        return new LayoutMenuGroupData(
            key: $this->key,
            items: $this->items,
        );
    }
}
