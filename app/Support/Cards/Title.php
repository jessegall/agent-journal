<?php

declare(strict_types=1);

namespace App\Support\Cards;

use App\Enums\PartType;
use App\Support\Cards\Contracts\DockPart;

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
