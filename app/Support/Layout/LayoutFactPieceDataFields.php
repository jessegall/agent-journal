<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Exceptions\MissingFields;
use Spatie\LaravelData\Optional;

final class LayoutFactPieceDataFields
{
    private string $label;

    private string|Optional $href;

    public function __construct()
    {
        $this->href = new Optional();
    }

    public function label(string $label): self
    {
        $this->label = $label;

        return $this;
    }

    public function href(string|Optional $href): self
    {
        $this->href = $href;

        return $this;
    }

    public function finish(): LayoutFactPieceData
    {
        if (! isset($this->label)) {
            throw MissingFields::forType(LayoutFactPieceData::class, 'label');
        }

        return new LayoutFactPieceData(
            label: $this->label,
            href: $this->href,
        );
    }
}
