<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Exceptions\MissingFields;

final class LayoutProgressDataFields
{
    private float $value;

    private float $max;

    private string $label;

    private string $unit;

    public function value(float $value): self
    {
        $this->value = $value;

        return $this;
    }

    public function max(float $max): self
    {
        $this->max = $max;

        return $this;
    }

    public function label(string $label): self
    {
        $this->label = $label;

        return $this;
    }

    public function unit(string $unit): self
    {
        $this->unit = $unit;

        return $this;
    }

    public function finish(): LayoutProgressData
    {
        if (! isset($this->value)) {
            throw MissingFields::forType(LayoutProgressData::class, 'value');
        }

        if (! isset($this->max)) {
            throw MissingFields::forType(LayoutProgressData::class, 'max');
        }

        if (! isset($this->label)) {
            throw MissingFields::forType(LayoutProgressData::class, 'label');
        }

        if (! isset($this->unit)) {
            throw MissingFields::forType(LayoutProgressData::class, 'unit');
        }

        return new LayoutProgressData(
            value: $this->value,
            max: $this->max,
            label: $this->label,
            unit: $this->unit,
        );
    }
}
