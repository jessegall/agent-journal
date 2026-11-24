<?php

declare(strict_types=1);

namespace App\Events\Sessions;

/**
 * A revision fence was reconciled.
 */
final readonly class RevisionFenceReconciled extends SessionEvent
{
    public function __construct(
        public string $fenceId,
    ) {}
}
