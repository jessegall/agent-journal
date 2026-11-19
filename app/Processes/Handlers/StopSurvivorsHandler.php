<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Contracts\CommandHandler;
use App\Processes\Commands\StopSurvivors;
use App\Processes\Enums\LifecycleState;
use App\Processes\Exceptions\RetryRefused;
use App\Processes\Models\ProcessRun;

final readonly class StopSurvivorsHandler implements CommandHandler
{
    /**
     * @throws RetryRefused
     */
    public function handle(StopSurvivors $command): string
    {
        $run = ProcessRun::query()->acrossActors()->whereKey($command->runId)->lockForUpdate()->sole();
        if ($run->lifecycle !== LifecycleState::Lost) {
            throw RetryRefused::notLost($run->id);
        }
        $run->markStale('stopped: the run was lost and a user stopped what survived');

        return $run->id;
    }
}
