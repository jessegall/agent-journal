<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\JournalRoute;
use App\Calls\Processes\ShowCommandRequestCall;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Shows a command request: its state, the steps it still requires, the next allowed command, its proposals and readers.
 */
#[JournalRoute(JournalRouteType::Read)]
final class CommandTypeShowCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'command-type:show {request : The command request id} {--json}';

    protected $description = 'Show a command request and its next step';

    public function handle(): int
    {
        return $this->runCall(ShowCommandRequestCall::from(['commandRequest' => (string) $this->argument('request')]));
    }
}
