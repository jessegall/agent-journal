<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Imports a repository declaration file as proposals: the file is read here, on the agent's side, and sent whole.
 */
#[JournalRoute(JournalRouteType::Write)]
final class CommandTypeImportCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'command-type:import {file : The declaration file} {--json}';

    protected $description = 'Import a declaration file as proposals';

    public function handle(AgentRequestSender $journal): int
    {
        $file = (string) $this->argument('file');
        if (! is_file($file)) {
            $this->error("There is no declaration file at {$file}.");

            return self::FAILURE;
        }

        return $this->sendAndPrint($journal, '/agent/processes/proposals/import', [
            'declarations' => (string) file_get_contents($file),
        ]);
    }
}
