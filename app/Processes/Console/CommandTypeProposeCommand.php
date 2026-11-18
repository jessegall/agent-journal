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
 * Proposes a declaration for a command request: --declaration is the rule and its examples as JSON.
 */
#[JournalRoute(JournalRouteType::Write)]
final class CommandTypeProposeCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'command-type:propose {request : The command request id}'
        .' {--declaration= : The rule and its examples as JSON} {--evidence= : Why the declared effects are right}'
        .' {--request-id= : The id that makes a retry the same proposal} {--json}';

    protected $description = 'Propose a declaration for a command request';

    public function handle(AgentRequestSender $journal): int
    {
        try {
            $declaration = json_decode((string) $this->option('declaration'), true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException $broken) {
            $this->error("The declaration is not JSON: {$broken->getMessage()}");

            return self::FAILURE;
        }

        return $this->sendAndPrint($journal, "/agent/processes/requests/{$this->argument('request')}/proposals", [
            'declaration' => [
                ...(is_array($declaration) ? $declaration : []),
                'request_id' => (string) $this->option('request-id'),
                'evidence' => (string) $this->option('evidence'),
            ],
        ]);
    }
}
