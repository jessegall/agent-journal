<?php

declare(strict_types=1);

namespace App\Events;

/**
 * A merge attempt of approved work ended: merged, refused or uncertain, heard in the same transaction, so settling it
 * is part of the merge's one command.
 */
final readonly class MergeOutcomeRecorded extends SessionEvent
{
    public function __construct(public string $attemptId) {}
}
