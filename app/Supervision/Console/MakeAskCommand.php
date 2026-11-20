<?php

declare(strict_types=1);

namespace App\Supervision\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use App\Supervision\Calls\MakeAskCall;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class MakeAskCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'ask:make {text} {--type=} {--request-key=} {--json}';

    protected $description = 'Ask the supervisor for help';

    public function handle(): int
    {
        return $this->runCall(MakeAskCall::from([
            'body' => (string) $this->argument('text'),
            'type' => $this->option('type'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
