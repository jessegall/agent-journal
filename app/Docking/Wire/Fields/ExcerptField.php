<?php

declare(strict_types=1);

namespace App\Docking\Wire\Fields;

use App\Docking\Cards\Contracts\DockPart;
use App\Docking\Wire\Contracts\PartField;
use App\Docking\Wire\DestinationEncoder;

/**
 * A field holding a chat excerpt's messages, in order.
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
