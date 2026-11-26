<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Wire\Fields;

use DateTimeInterface;
use Domain\Chat\Contracts\Docking\DockPart;
use Domain\Chat\Contracts\Docking\PartField;
use Domain\Chat\Support\Wire\DestinationEncoder;

/**
 * A field holding a moment, written in ISO 8601; an optional one is null where the part leaves it out.
 */
final readonly class InstantField implements PartField
{
    private function __construct(private string $name, private bool $isOptional) {}

    public static function named(string $name): self
    {
        return new self($name, false);
    }

    public static function optional(string $name): self
    {
        return new self($name, true);
    }

    public function name(): string
    {
        return $this->name;
    }

    public function typeScript(): string
    {
        if ($this->isOptional) {
            return 'string | null';
        }

        return 'string';
    }

    public function encode(DockPart $part, DestinationEncoder $destinations): mixed
    {
        $value = $part->{$this->name};

        if ($value instanceof DateTimeInterface) {
            return $value->format(DateTimeInterface::ATOM);
        }

        return null;
    }
}
