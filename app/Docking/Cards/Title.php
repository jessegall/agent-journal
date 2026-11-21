<?php

declare(strict_types=1);

namespace App\Docking\Cards;

use App\Docking\Cards\Contracts\DockPart;
use App\Docking\Enums\PartType;

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
