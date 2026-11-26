<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use App\Processes\Api\ListProposalsPayload;
use Illuminate\Console\Command;

/**
 * Lists the project's proposals, in one state or all.
 */
#[JournalRoute(JournalRouteType::Read)]
final class CommandTypeListCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'command-type:list {--state= : draft, pending, approved, rejected, withdrawn or superseded} {--json}';

    protected $description = 'List proposals';

    public function handle(): int
    {
        $state = (string) $this->option('state');

        return $this->runCall(ListProposalsPayload::from(['states' => $state === '' ? [] : [$state]]));
    }
}
