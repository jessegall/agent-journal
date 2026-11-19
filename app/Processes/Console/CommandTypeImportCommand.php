<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Calls\ImportProposalsCall;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Imports a repository declaration file as proposals: the file is read here, on the agent's side, and sent whole.
 */
#[JournalRoute(JournalRouteType::Write)]
final class CommandTypeImportCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'command-type:import {file : The declaration file}'
        .' {--request-key= : The key that makes a retry get the same answer} {--json}';

    protected $description = 'Import a declaration file as proposals';

    public function handle(): int
    {
        $file = (string) $this->argument('file');

        if (! is_file($file)) {
            $this->error("There is no declaration file at {$file}.");

            return self::FAILURE;
        }

        return $this->runCall(ImportProposalsCall::from([
            'declarations' => (string) file_get_contents($file),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
