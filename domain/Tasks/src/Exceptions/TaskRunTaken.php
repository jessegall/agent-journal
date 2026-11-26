<?php

declare(strict_types=1);

namespace Domain\Tasks\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Contracts\Refusals\RefusalRecovery;
use App\Engine\Enums\RefusalCode;
use App\Values\RecoveryCall;
use Domain\Tasks\Models\Task;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

/**
 * A task run another session owns, which a start may not take.
 */
final class TaskRunTaken extends RuntimeException implements CodedRefusal, CommandRefusal, RefusalRecovery
{
    use RendersRefusal;

    private function __construct(string $message, private readonly string $taskId)
    {
        parent::__construct($message);
    }

    public static function forTask(Task $task): self
    {
        return new self(
            "Task {$task->number} is being worked on by another session. It can be started when that run ends.",
            $task->id,
        );
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }

    protected function status(): int
    {
        return Response::HTTP_CONFLICT;
    }

    public function recovery(): RecoveryCall
    {
        return new RecoveryCall('tasks_read', ['task_id' => $this->taskId]);
    }

    /**
     * @return array<string, mixed>
     */
    protected function details(): array
    {
        return RecoveryCall::detailsOf($this->recovery());
    }
}
