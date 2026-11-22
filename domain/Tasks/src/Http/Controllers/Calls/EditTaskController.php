<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Controllers\Calls;

use App\Contracts\Bus\CommandBus;
use Domain\Tasks\Calls\EditTaskCall;
use Domain\Tasks\Calls\TaskEdited;
use Domain\Tasks\Commands\EditTask\EditTaskCommand;

/**
 * Edits a task and answers its revision.
 */
final readonly class EditTaskController
{
    public function __invoke(EditTaskCall $call, CommandBus $commands): TaskEdited
    {
        $revision = $commands->run(new EditTaskCommand($call->taskId, $call->expectedRevision, $call->title, $call->brief));

        return TaskEdited::from(['taskId' => $call->taskId, 'revision' => $revision]);
    }
}
