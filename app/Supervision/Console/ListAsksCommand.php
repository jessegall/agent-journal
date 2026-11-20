<?php

declare(strict_types=1);

namespace App\Supervision\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use App\Supervision\Calls\ListAsksCall;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class ListAsksCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'ask:list {--before=} {--json}';

    protected $description = 'List asks you can read';

    public function handle(): int
    {
        return $this->runCall(ListAsksCall::from([
            'before' => $this->option('before'),
        ]));
    }
}
