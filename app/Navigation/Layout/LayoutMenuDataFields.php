<?php

declare(strict_types=1);

namespace App\Navigation\Layout;

use App\Web\Creation\Exceptions\MissingFields;

final class LayoutMenuDataFields
{
    private string $key;

    private string $label;

    /** @var list<LayoutMenuGroupData> */
    private array $groups;

    public function key(string $key): self
    {
        $this->key = $key;

        return $this;
    }

    public function label(string $label): self
    {
        $this->label = $label;

        return $this;
    }

    /** @param list<LayoutMenuGroupData> $groups */
    public function groups(array $groups): self
    {
        $this->groups = $groups;

        return $this;
    }

    public function finish(): LayoutMenuData
    {
        if (! isset($this->key)) {
            throw MissingFields::forType(LayoutMenuData::class, 'key');
        }

        if (! isset($this->label)) {
            throw MissingFields::forType(LayoutMenuData::class, 'label');
        }

        if (! isset($this->groups)) {
            throw MissingFields::forType(LayoutMenuData::class, 'groups');
        }

        return new LayoutMenuData(
            key: $this->key,
            label: $this->label,
            groups: $this->groups,
        );
    }
}
