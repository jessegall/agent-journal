<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Cards;

use Domain\Chat\Contracts\Docking\DockPart;
use Domain\Chat\Enums\PartType;

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
