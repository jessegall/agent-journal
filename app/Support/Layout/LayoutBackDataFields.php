<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Exceptions\MissingFields;

final class LayoutBackDataFields
{
    private string $href;

    private string $label;

    public function href(string $href): self
    {
        $this->href = $href;

        return $this;
    }

    public function label(string $label): self
    {
        $this->label = $label;

        return $this;
    }

    public function finish(): LayoutBackData
    {
        if (! isset($this->href)) {
            throw MissingFields::forType(LayoutBackData::class, 'href');
        }

        if (! isset($this->label)) {
            throw MissingFields::forType(LayoutBackData::class, 'label');
        }

        return new LayoutBackData(
            href: $this->href,
            label: $this->label,
        );
    }
}
