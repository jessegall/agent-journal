<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Contracts\CommandHandler;
use App\Processes\Commands\StopSurvivors;
use App\Processes\Enums\LifecycleState;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Exceptions\RetryRefused;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\ProcessRun;
use App\Processes\Policies\ProcessAdministrationPolicy;

final readonly class StopSurvivorsHandler implements CommandHandler
{
    public function __construct(private CurrentAuthorizer $administration) {}

    /**
     * @throws RetryRefused
     */
    public function handle(StopSurvivors $command): string
    {
        $this->administration->authorize(ProcessAdministrationPolicy::class, CommandRequest::class, ProcessAbility::Administer);
        $run = ProcessRun::query()->withoutGlobalScopes()->whereKey($command->runId)->lockForUpdate()->sole();
        if ($run->lifecycle !== LifecycleState::Lost) {
            throw RetryRefused::notLost($run->id);
        }
        $run->markStale('stopped: the run was lost and a user stopped what survived');

        return $run->id;
    }
}
