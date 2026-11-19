<?php

declare(strict_types=1);

namespace App\Assignments\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Assignments\Calls\ShowAssignmentCall;
use App\Assignments\Console\Concerns\ReadsAssignmentArguments;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Show who holds one record and its assignment reference, over a signed call as the agent of the launch.
 */
#[JournalRoute(JournalRouteType::Read)]
final class ShowAssignmentCommand extends Command
{
    use ReadsAssignmentArguments;
    use RunsCallPipelines;

    protected $signature = 'assignment:show {type} {id} {--json}';

    protected $description = 'Show who holds one record and its assignment reference';

    public function handle(): int
    {
        return $this->runCall(ShowAssignmentCall::from($this->recordFields()));
    }
}
