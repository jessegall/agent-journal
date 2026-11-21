<?php

declare(strict_types=1);

namespace App\Docking\Cards;

use App\Docking\Cards\Contracts\DockPart;
use App\Docking\Enums\PartType;

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
