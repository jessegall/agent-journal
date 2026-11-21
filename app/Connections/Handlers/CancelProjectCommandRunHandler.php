<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Connections\Commands\CancelProjectCommandRun;
use App\Connections\Models\ProjectCommandRun;
use App\Contracts\CommandHandler;

/**
 * Stops the running process of the agent's own run of this request id and marks the run cancelled.
 */
final readonly class CancelProjectCommandRunHandler implements CommandHandler
{
    public function handle(CancelProjectCommandRun $command): void
    {
        foreach (ProjectCommandRun::lockByRequest($command->requestId) as $run) {
            if ($run->agent_id !== $command->agentId || ! $run->isRunning()) {
                continue;
            }

            if ($run->pid !== null) {
                posix_kill($run->pid, SIGTERM);
            }

            $run->cancel();
        }
    }
}
