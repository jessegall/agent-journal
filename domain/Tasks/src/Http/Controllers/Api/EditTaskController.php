<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Controllers\Api;

use App\Contracts\Bus\CommandBus;
use Domain\Tasks\Api\EditTaskPayload;
use Domain\Tasks\Api\TaskEdited;
use Domain\Tasks\Commands\EditTask\EditTaskCommand;

/**
 * Edits a task and answers its revision.
 */
final readonly class EditTaskController
{
    public function __invoke(EditTaskPayload $call, CommandBus $commands): TaskEdited
    {
        $revision = $commands->run(
            new EditTaskCommand($call->taskId, $call->expectedRevision, $call->title, $call->brief),
        );

        return TaskEdited::from([
            'taskId' => $call->taskId,
            'revision' => $revision,
        ]);
    }
}
