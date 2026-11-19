<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Calls\ListProposalsCall;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Lists the project's proposals, in one state or all.
 */
#[JournalRoute(JournalRouteType::Read)]
final class CommandTypeListCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'command-type:list {--state= : draft, pending, approved, rejected, withdrawn or superseded} {--json}';

    protected $description = 'List proposals';

    public function handle(): int
    {
        $state = (string) $this->option('state');

        return $this->runCall(ListProposalsCall::from(['states' => $state === '' ? [] : [$state]]));
    }
}
