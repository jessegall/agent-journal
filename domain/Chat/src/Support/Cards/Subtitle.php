<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Cards;

use Domain\Chat\Contracts\Docking\DockPart;
use Domain\Chat\Enums\PartType;

/**
 * Secondary text under a heading.
 */
final readonly class Subtitle implements DockPart
{
    public function __construct(public string $key, public string $text)
    {
        PartKey::assertGiven($key, PartType::Subtitle);
    }

    public function key(): string
    {
        return $this->key;
    }

    public function type(): PartType
    {
        return PartType::Subtitle;
    }

    public function children(): array
    {
        return [];
    }
}
