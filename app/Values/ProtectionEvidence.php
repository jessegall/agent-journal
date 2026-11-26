<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Drivers\BoundaryItem;

/**
 * The recorded runs of one host that showed a boundary item hold, by the key of a driver, build and platform.
 */
final readonly class ProtectionEvidence
{
    /**
     * @param  array<string, array<string, string>>  $runs
     */
    public function __construct(private array $runs) {}

    /**
     * The run that showed the item hold under the key; empty when none was recorded.
     */
    public function runOf(string $key, BoundaryItem $item): string
    {
        return $this->runs[$key][$item->value] ?? '';
    }
}
