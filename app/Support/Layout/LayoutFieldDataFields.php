<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Exceptions\MissingFields;

final class LayoutFieldDataFields
{
    private string $name;

    private string $value = '';

    /** @var list<string> */
    private array $clears = [];

    /** @var list<string> */
    private array $options = [];

    /** @var list<string> */
    private array $optionLabels = [];

    public function name(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function value(string $value): self
    {
        $this->value = $value;

        return $this;
    }

    /** @param list<string> $clears */
    public function clears(array $clears): self
    {
        $this->clears = $clears;

        return $this;
    }

    /** @param list<string> $options */
    public function options(array $options): self
    {
        $this->options = $options;

        return $this;
    }

    /** @param list<string> $optionLabels */
    public function optionLabels(array $optionLabels): self
    {
        $this->optionLabels = $optionLabels;

        return $this;
    }

    public function finish(): LayoutFieldData
    {
        if (! isset($this->name)) {
            throw MissingFields::forType(LayoutFieldData::class, 'name');
        }

        return new LayoutFieldData(
            name: $this->name,
            value: $this->value,
            clears: $this->clears,
            options: $this->options,
            optionLabels: $this->optionLabels,
        );
    }
}
