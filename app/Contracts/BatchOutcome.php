<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Values\SourcePosition;

/**
 * How a provider's batch ends: the range exhausted, more after these hits, still scanning, failed, or refreshed.
 */
interface BatchOutcome
{
    /**
     * Whether a batch with this outcome may carry hits.
     */
    public function canCarryHits(): bool;

    /**
     * Whether the source failed on this call, so it is asked no more.
     */
    public function isFailure(): bool;

    /**
     * Where the source goes on from on its next call; null keeps the position it holds.
     */
    public function nextPosition(): SourcePosition|null;

    /**
     * Whether the source has nothing more after this batch.
     */
    public function isLastBatch(): bool;

    /**
     * The outcome's name, as diagnostics and refusals write it.
     */
    public function name(): string;
}
