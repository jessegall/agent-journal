<?php

declare(strict_types=1);

namespace App\Docking\Wire\Fields;

use App\Docking\Cards\Contracts\DockPart;
use App\Docking\Wire\Contracts\PartField;
use App\Docking\Wire\DestinationEncoder;

/**
 * A field holding lines of plain text, in order.
 */
final readonly class LinesField implements PartField
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
        return 'string[]';
    }

    public function encode(DockPart $part, DestinationEncoder $destinations): mixed
    {
        $value = $part->{$this->name};

        return is_array($value) ? array_values(array_map(strval(...), $value)) : [];
    }
}
