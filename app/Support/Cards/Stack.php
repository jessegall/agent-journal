<?php

declare(strict_types=1);

namespace App\Support\Cards;

use App\Processes\Enums\PartType;
use App\Support\Cards\Contracts\DockPart;

/**
 * Parts shown one under another, in order.
 */
final readonly class Stack implements DockPart
{
    /**
     * @var list<DockPart>
     */
    public array $children;

    public function __construct(public string $key, DockPart ...$children)
    {
        PartKey::assertGiven($key, PartType::Stack);

        $this->children = array_values($children);
    }

    public static function of(string $key, DockPart ...$children): self
    {
        return new self($key, ...$children);
    }

    public function key(): string
    {
        return $this->key;
    }

    public function type(): PartType
    {
        return PartType::Stack;
    }

    public function children(): array
    {
        return $this->children;
    }
}
