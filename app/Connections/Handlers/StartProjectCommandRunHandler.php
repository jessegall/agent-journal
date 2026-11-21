<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Connections\Commands\StartProjectCommandRun;
use App\Connections\Models\ProjectBinding;
use App\Connections\Models\ProjectCommandRun;
use App\Connections\Values\CommandRunStart;
use App\Contracts\CommandHandler;

/**
 * Locks the request id's run; answers it when there is one, else starts one.
 */
final readonly class StartProjectCommandRunHandler implements CommandHandler
{
    public function handle(StartProjectCommandRun $command): CommandRunStart
    {
        foreach (ProjectCommandRun::lockByRequest($command->requestKey) as $earlier) {
            return new CommandRunStart(false, $earlier->isRunning(), $earlier->recordedFrames());
        }

        $binding = ProjectBinding::lockById($command->bindingId);
        ProjectCommandRun::create($command->requestKey, $command->agentId, $binding, $command->argv);

        return new CommandRunStart(true, true, []);
    }
}
