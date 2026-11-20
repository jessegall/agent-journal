<?php

declare(strict_types=1);

namespace App\Supervision\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use App\Supervision\Calls\ShowAskCall;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class ShowAskCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'ask:show {ask} {--json}';

    protected $description = 'Read one ask';

    public function handle(): int
    {
        return $this->runCall(ShowAskCall::from([
            'id' => (string) $this->argument('ask'),
        ]));
    }
}
