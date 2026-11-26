<?php

declare(strict_types=1);

namespace App\Support\Cards;

use App\Exceptions\DockCardInvalid;
use App\Processes\Enums\PartType;
use App\Support\Cards\Contracts\DockPart;

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
