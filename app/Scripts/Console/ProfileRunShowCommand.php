<?php

declare(strict_types=1);

namespace App\Scripts\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use App\Scripts\Calls\ShowProfileRunCall;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class ProfileRunShowCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'profile:run-show {run} {--json}';

    protected $description = 'Read one of your profile runs and its recorded steps';

    public function handle(): int
    {
        return $this->runCall(ShowProfileRunCall::from(['id' => (string) $this->argument('run')]));
    }
}
