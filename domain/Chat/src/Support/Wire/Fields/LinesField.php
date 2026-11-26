<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Wire\Fields;

use Domain\Chat\Contracts\Docking\DockPart;
use Domain\Chat\Contracts\Docking\PartField;
use Domain\Chat\Support\Wire\DestinationEncoder;

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

        if (is_array($value)) {
            return array_values(array_map(strval(...), $value));
        }

        return [];
    }
}
