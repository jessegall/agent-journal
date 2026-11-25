<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\JournalRoute;
use App\Calls\Supervision\ShowAskCall;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
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
