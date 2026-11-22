<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Processes\Calls\ProposalReceived;
use App\Processes\Calls\ReviseProposalCall;
use App\Processes\Commands\ReviseRuleProposal\ReviseRuleProposalCommand;
use App\Processes\Declarations\RuleDeclarations;

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
        $declared = $declarations->readOne([...$call->declaration, 'request_id' => $call->proposal]);
        $command = new ReviseRuleProposalCommand($call->proposal, (int) $call->expectedRevision, $declared->proposed);

        return ProposalReceived::from($commands->run($command)->toArray());
    }
}
