<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\AssignmentFactPublisher;
use App\Assignments\Enums\AssignmentReason;
use App\Assignments\Events\AssignmentsChanged;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Str;

/**
 * Raises the one committed fact of a command that changed assignments. Raised inside the command's transaction, it
 * waits for the commit, and an attempt that rolled back to be run again leaves nothing behind.
 */
final readonly class AssignmentFacts implements AssignmentFactPublisher
{
    public function __construct(private Dispatcher $events) {}

    public function publish(ActorIdentity $actor, AssignmentReason $reason, AssignmentResult $change): void
    {
        if (! $change->hasChanges()) {
            return;
        }

        $this->events->dispatch(new AssignmentsChanged(
            (string) Str::uuid(),
            $actor,
            $reason,
            $change->changes,
            CarbonImmutable::now(),
        ));
    }
}
