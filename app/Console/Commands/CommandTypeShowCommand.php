<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Processes\ShowCommandRequestPayload;
use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use Illuminate\Console\Command;

/**
 * Shows a command request: its state, the steps it still requires, the next allowed command, its proposals and readers.
 */
#[JournalRoute(JournalRouteType::Read)]
final class CommandTypeShowCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'command-type:show {request : The command request id} {--json}';

    protected $description = 'Show a command request and its next step';

    public function handle(): int
    {
        return $this->runCall(
            ShowCommandRequestPayload::from(['commandRequest' => (string) $this->argument('request')]),
        );
    }
}
