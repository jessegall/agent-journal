<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Cards;

use Domain\Chat\Contracts\Docking\DockPart;
use Domain\Chat\Enums\PartType;
use Domain\Chat\Exceptions\DockCardInvalid;

/**
 * Progress that counts done work against the known total, shown as 3 of 8.
 */
final readonly class CountedProgress implements DockPart
{
    public function __construct(public string $key, public int $completed, public int $total)
    {
        PartKey::assertGiven($key, PartType::CountedProgress);

        if ($completed < 0 || $total <= 0 || $completed > $total) {
            throw DockCardInvalid::progressOutOfRange($key, $completed, $total);
        }
    }

    public function key(): string
    {
        return $this->key;
    }

    public function type(): PartType
    {
        return PartType::CountedProgress;
    }

    public function children(): array
    {
        return [];
    }
}
