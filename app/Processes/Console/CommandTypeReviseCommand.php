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
 * Adds the next revision to the author's proposal, on top of the revision they read.
 */
#[JournalRoute(JournalRouteType::Write)]
final class CommandTypeReviseCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'command-type:revise {proposal : The proposal id}'
        .' {--expected-revision= : The revision read} {--declaration= : The rule and its examples as JSON}'
        .' {--evidence= : Why the declared effects are right} {--json}';

    protected $description = 'Revise a proposal';

    public function handle(AgentRequestSender $journal): int
    {
        try {
            $declaration = json_decode((string) $this->option('declaration'), true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException $broken) {
            $this->error("The declaration is not JSON: {$broken->getMessage()}");

            return self::FAILURE;
        }

        return $this->sendAndPrint($journal, "/agent/processes/proposals/{$this->argument('proposal')}/revisions", [
            'expected_revision' => (int) $this->option('expected-revision'),
            'declaration' => [
                ...(is_array($declaration) ? $declaration : []),
                'request_id' => (string) $this->argument('proposal'),
                'evidence' => (string) $this->option('evidence'),
            ],
        ]);
    }
}
