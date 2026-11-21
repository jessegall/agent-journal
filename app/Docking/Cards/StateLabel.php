<?php

declare(strict_types=1);

namespace App\Docking\Cards;

use App\Docking\Cards\Contracts\DockPart;
use App\Docking\Enums\PartType;
use App\Docking\Enums\Tone;

/**
 * A short state word in its tone, such as Running or Failed.
 */
final readonly class StateLabel implements DockPart
{
    public function __construct(public string $key, public string $text, public Tone $tone)
    {
        PartKey::assertGiven($key, PartType::StateLabel);
    }

    public function key(): string
    {
        return $this->key;
    }

    public function type(): PartType
    {
        return PartType::StateLabel;
    }

    public function children(): array
    {
        return [];
    }
}
