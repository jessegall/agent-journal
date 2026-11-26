<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Cards;

use Domain\Chat\Contracts\Docking\DockPart;
use Domain\Chat\Enums\PartType;

/**
 * The card's fixed heading.
 */
final readonly class Title implements DockPart
{
    public function __construct(public string $key, public string $text)
    {
        PartKey::assertGiven($key, PartType::Title);
    }

    public function key(): string
    {
        return $this->key;
    }

    public function type(): PartType
    {
        return PartType::Title;
    }

    public function children(): array
    {
        return [];
    }
}
