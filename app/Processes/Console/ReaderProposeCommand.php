<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;
use JsonException;

/**
 * Proposes the reader for a command request's declaration revision; the journal stores it as a draft.
 */
#[JournalRoute(JournalRouteType::Write)]
final class ReaderProposeCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'reader:propose {request : The command request id}'
        .' {--declaration-revision= : The declaration revision the reader reads}'
        .' {--definition= : The reader definition as JSON} {--json}';

    protected $description = 'Propose a draft reader for a command request';

    public function handle(AgentRequestSender $journal): int
    {
        try {
            $definition = json_decode((string) $this->option('definition'), true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException $broken) {
            $this->error("The definition is not JSON: {$broken->getMessage()}");

            return self::FAILURE;
        }

        return $this->sendAndPrint($journal, "/agent/processes/requests/{$this->argument('request')}/readers", [
            'declaration_revision' => (int) $this->option('declaration-revision'),
            'definition' => $definition,
        ]);
    }
}
