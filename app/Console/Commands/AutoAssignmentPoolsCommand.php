<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Assignments\Api\ListAssignmentPoolsPayload;
use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use Illuminate\Console\Command;

/**
 * List the pools a record type may be drawn from, over a signed call as the agent of the start.
 */
#[JournalRoute(JournalRouteType::Read)]
final class AutoAssignmentPoolsCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'assignment:auto-pools {type : The record type, such as tasks.task} {--json}';

    protected $description = 'List the pools a record type may be drawn from';

    public function handle(): int
    {
        return $this->runCall(ListAssignmentPoolsPayload::from(['assignableType' => (string) $this->argument('type')]));
    }
}
