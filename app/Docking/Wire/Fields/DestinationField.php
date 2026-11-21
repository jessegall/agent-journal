<?php

declare(strict_types=1);

namespace App\Docking\Wire\Fields;

use App\Docking\Cards\Contracts\DockPart;
use App\Docking\Cards\DockDestination;
use App\Docking\Wire\Contracts\PartField;
use App\Docking\Wire\DestinationEncoder;

/**
 * A field holding the page a part opens, or null when it opens none.
 */
final readonly class DestinationField implements PartField
{
    public function __construct(private string $name) {}

    public static function named(string $name): self
    {
        return new self($name);
    }

    public function name(): string
    {
        return $this->name;
    }

    public function typeScript(): string
    {
        return 'DockLink | null';
    }

    public function encode(DockPart $part, DestinationEncoder $destinations): mixed
    {
        $value = $part->{$this->name};

        return $value instanceof DockDestination ? $destinations->encode($value) : null;
    }
}
