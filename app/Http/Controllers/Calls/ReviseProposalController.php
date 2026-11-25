<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Processes\ProposalReceived;
use App\Calls\Processes\ReviseProposalCall;
use App\Commands\CommandRules\ReviseRuleProposal\ReviseRuleProposalCommand;
use App\Contracts\Bus\CommandBus;
use App\Declarations\RuleDeclarations;

/**
 * Revises a proposal from its declaration and answers it.
 */
final readonly class ReviseProposalController
{
    public function __invoke(
        ReviseProposalCall $call,
        RuleDeclarations $declarations,
        CommandBus $commands,
    ): ProposalReceived {
        $declared = $declarations->readOne([
            ...$call->declaration,
            'request_id' => $call->proposal,
        ]);
        $command = new ReviseRuleProposalCommand($call->proposal, (int) $call->expectedRevision, $declared->proposed);

        return ProposalReceived::from($commands->run($command)->toArray());
    }
}
