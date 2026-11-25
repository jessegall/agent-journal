<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Controllers;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Bus\CommandBus;
use Domain\Tasks\Commands\CreateTask\CreateTaskCommand;
use Domain\Tasks\Http\Requests\CreateTaskRequest;
use Domain\Tasks\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Files a task from the create dialog and follows the server to the new task's own page.
 */
final readonly class CreateTaskPageController
{
    #[Dispatches(CreateTaskCommand::class)]
    public function __invoke(CreateTaskRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $id = $commands->run(new CreateTaskCommand($request->title(), $request->brief()));

        return $redirect->to(route('tasks.task', ['task' => Task::resolveNumberOf($id)], false), 303);
    }
}
