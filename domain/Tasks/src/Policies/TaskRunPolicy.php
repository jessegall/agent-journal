<?php

declare(strict_types=1);

namespace Domain\Tasks\Policies;

use App\Contracts\Actor;
use App\Contracts\RecordPolicy;
use App\Contracts\RunClaims;
use App\Enums\AccessType;
use App\Support\ActorIdentity;
use Domain\Tasks\Models\Task;
use Illuminate\Auth\Access\Response;

/**
 * Who may work a task's run: anyone granted Create may open or resume one, and the task itself refuses a run another
 * holds; only the run's holder finishes, blocks or cancels it.
 */
final readonly class TaskRunPolicy implements RecordPolicy
{
    public function __construct(private RunClaims $claims) {}

    public static function model(): string
    {
        return Task::class;
    }

    public function permits(Actor $actor, Task $task, AccessType $access): Response
    {
        return match ($access) {
            AccessType::Create => Response::allow(),
            AccessType::Edit => $this->holdsTheRun($task, ActorIdentity::of($actor))
                ? Response::allow()
                : Response::deny('The actor does not hold this run.'),
            default => Response::deny(),
        };
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
