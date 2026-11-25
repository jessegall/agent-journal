<?php

declare(strict_types=1);

namespace App\Support\Cards;

use App\Enums\Runs\PartType;
use App\Support\Cards\Contracts\DockPart;

/**
 * Progress whose total is unknown, shown by its label and no invented percentage.
 */
final readonly class IndeterminateProgress implements DockPart
{
    public function __construct(public string $key, public string $label)
    {
        PartKey::assertGiven($key, PartType::IndeterminateProgress);
    }

    public function key(): string
    {
        return $this->key;
    }

    public function type(): PartType
    {
        return PartType::IndeterminateProgress;
    }

    public function children(): array
    {
        return [];
    }
}
