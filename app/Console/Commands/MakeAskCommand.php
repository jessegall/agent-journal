<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\JournalRoute;
use App\Calls\Supervision\MakeAskCall;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
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
