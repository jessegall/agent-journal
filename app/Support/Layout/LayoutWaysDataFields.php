<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Exceptions\MissingFields;

final class LayoutWaysDataFields
{
    private string $plain;

    private string $guided;

    private bool $isInHeader = false;

    public function plain(string $plain): self
    {
        $this->plain = $plain;

        return $this;
    }

    public function guided(string $guided): self
    {
        $this->guided = $guided;

        return $this;
    }

    public function isInHeader(bool $isInHeader): self
    {
        $this->isInHeader = $isInHeader;

        return $this;
    }

    public function finish(): LayoutWaysData
    {
        if (! isset($this->plain)) {
            throw MissingFields::forType(LayoutWaysData::class, 'plain');
        }

        if (! isset($this->guided)) {
            throw MissingFields::forType(LayoutWaysData::class, 'guided');
        }

        return new LayoutWaysData(
            plain: $this->plain,
            guided: $this->guided,
            isInHeader: $this->isInHeader,
        );
    }
}
