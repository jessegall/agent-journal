<?php

declare(strict_types=1);

namespace Domain\Tasks\Policies;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Policy;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\ActorIdentity;
use App\Desks\Contracts\RunClaims;
use BackedEnum;
use Domain\Tasks\Enums\TaskAbility;
use Domain\Tasks\Models\Task;

/**
 * Who may act on a task's run: anyone granted may start a task, and the task itself refuses a run another holds;
 * only the run's holder finishes, blocks or cancels it.
 */
final readonly class TaskPolicy implements Policy
{
    public function __construct(private RunClaims $claims) {}

    /**
     * @param  object|class-string  $subject
     *
     * @throws ActorNotAllowed
     */
    public function authorize(Actor $actor, object|string $subject, BackedEnum $ability): void
    {
        if (! $ability instanceof TaskAbility || ! $ability->needsTheRunHolder()) {
            return;
        }

        if (! $subject instanceof Task || ! $this->holdsTheRun($subject, ActorIdentity::of($actor))) {
            throw ActorNotAllowed::to($ability, 'task');
        }
    }

    /**
     * Whether the actor's claim on the task's latest run still stands.
     */
    private function holdsTheRun(Task $task, ActorIdentity $actor): bool
    {
        $run = $task->currentRun();
        $holder = $run === null ? null : $this->claims->holderOf($run->assignmentIdentity())->getOrElse(null);

        return $holder !== null && $holder->isSameAs($actor);
    }
}
