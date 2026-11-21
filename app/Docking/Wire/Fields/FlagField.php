<?php

declare(strict_types=1);

namespace App\Docking\Wire\Fields;

use App\Docking\Cards\Contracts\DockPart;
use App\Docking\Wire\Contracts\PartField;
use App\Docking\Wire\DestinationEncoder;

/**
 * A field that is true or false.
 */
final readonly class FlagField implements PartField
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
        return 'boolean';
    }

    public function encode(DockPart $part, DestinationEncoder $destinations): mixed
    {
        $value = $part->{$this->name};

        return (bool) $value;
    }
}
