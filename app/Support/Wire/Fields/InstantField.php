<?php

declare(strict_types=1);

namespace App\Support\Wire\Fields;

use App\Support\Cards\Contracts\DockPart;
use App\Support\Wire\Contracts\PartField;
use App\Support\Wire\DestinationEncoder;
use DateTimeInterface;

/**
 * A field holding a moment, written in ISO 8601; an optional one is null where the part leaves it out.
 */
final readonly class InstantField implements PartField
{
    private function __construct(private string $name, private bool $optional) {}

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
        return $this->optional ? 'string | null' : 'string';
    }

    public function encode(DockPart $part, DestinationEncoder $destinations): mixed
    {
        $value = $part->{$this->name};

        return $value instanceof DateTimeInterface ? $value->format(DateTimeInterface::ATOM) : null;
    }
}
