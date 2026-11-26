<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Assignments\Api\ShowAssignmentPayload;
use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\ReadsAssignmentArguments;
use App\Console\Concerns\RunsApiPipelines;
use Illuminate\Console\Command;

/**
 * Show who holds one record and its assignment reference, over a signed call as the agent of the start.
 */
#[JournalRoute(JournalRouteType::Read)]
final class ShowAssignmentCommand extends Command
{
    use ReadsAssignmentArguments;
    use RunsApiPipelines;

    protected $signature = 'assignment:show {type} {id} {--json}';

    protected $description = 'Show who holds one record and its assignment reference';

    public function handle(): int
    {
        return $this->runCall(ShowAssignmentPayload::from($this->recordFields()));
    }
}
