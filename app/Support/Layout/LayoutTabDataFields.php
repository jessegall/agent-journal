<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Exceptions\MissingFields;

final class LayoutTabDataFields
{
    private string $key;

    private string $label;

    private bool $isChosen;

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

    public function isChosen(bool $isChosen): self
    {
        $this->isChosen = $isChosen;

        return $this;
    }

    public function finish(): LayoutTabData
    {
        if (! isset($this->key)) {
            throw MissingFields::forType(LayoutTabData::class, 'key');
        }

        if (! isset($this->label)) {
            throw MissingFields::forType(LayoutTabData::class, 'label');
        }

        if (! isset($this->isChosen)) {
            throw MissingFields::forType(LayoutTabData::class, 'isChosen');
        }

        return new LayoutTabData(
            key: $this->key,
            label: $this->label,
            isChosen: $this->isChosen,
        );
    }
}
