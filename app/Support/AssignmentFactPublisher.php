<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Assignments\AssignmentFactPublisher as AssignmentFactPublisherContract;
use App\Contracts\Bus\CommandFacts;
use App\Enums\Assignments\AssignmentReason;
use App\Events\Assignments\AssignmentsChanged;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;

/**
 * Raises the one committed fact of a command that changed assignments, through the command's ordered stream: it is
 * released after the commit, and an attempt that rolled back to be run again leaves nothing behind.
 */
final readonly class AssignmentFactPublisher implements AssignmentFactPublisherContract
{
    public function __construct(private CommandFacts $facts) {}

    public function publish(ActorIdentity $actor, AssignmentReason $reason, AssignmentResult $change): void
    {
        if (! $change->hasChanges()) {
            return;
        }

        $this->facts->publishAfterCommit(new AssignmentsChanged(
            (string) Str::uuid(),
            $actor,
            $reason,
            $change->changes,
            CarbonImmutable::now(),
        ));
    }
}
