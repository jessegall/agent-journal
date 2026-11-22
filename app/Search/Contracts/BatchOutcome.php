<?php

declare(strict_types=1);

namespace App\Search\Contracts;

/**
 * How a provider's batch ends: the range exhausted, more after these hits, still scanning, failed, or refreshed.
 */
interface BatchOutcome
{
    /**
     * Whether a batch with this outcome may carry hits.
     */
    public function carriesHits(): bool;

    /**
     * The outcome's name, as diagnostics and refusals write it.
     */
    public function name(): string;
}
