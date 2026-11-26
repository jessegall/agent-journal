<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Wire\Fields;

use Domain\Chat\Contracts\Docking\DockPart;
use Domain\Chat\Contracts\Docking\PartField;
use Domain\Chat\Support\Wire\DestinationEncoder;

/**
 * A field holding a messages excerpt's messages, in order.
 */
final readonly class ExcerptField implements PartField
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
        return '{speaker: string; sentAt: string; preview: string}[]';
    }

    public function encode(DockPart $part, DestinationEncoder $destinations): mixed
    {
        return $part->{$this->name};
    }
}
