<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\JournalRoute;
use App\Calls\Processes\ReviseProposalCall;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Adds the next revision to the author's proposal, on top of the revision they read.
 */
#[JournalRoute(JournalRouteType::Write)]
final class CommandTypeReviseCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'command-type:revise {proposal : The proposal id} {--expected-revision= : The revision read} {--declaration= : The rule and its examples as JSON} {--evidence= : Why the declared effects are right} {--request-key= : The key that makes a retry get the same answer} {--json}';

    protected $description = 'Revise a proposal';

    public function handle(): int
    {
        $declaration = $this->jsonOption('declaration');

        if ($declaration === null) {
            return self::FAILURE;
        }

        return $this->runCall(ReviseProposalCall::from([
            'proposal' => (string) $this->argument('proposal'),
            'declaration' => [
                ...$declaration,
                'evidence' => (string) $this->option('evidence'),
            ],
            'expectedRevision' => (int) $this->option('expected-revision'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
