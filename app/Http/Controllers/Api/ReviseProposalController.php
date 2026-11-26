<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\ProposalReceived;
use App\Api\Processes\ReviseProposalPayload;
use App\Attributes\Bus\Dispatches;
use App\Commands\CommandRules\ReviseRuleProposal\ReviseRuleProposalCommand;
use App\Contracts\Bus\CommandBus;
use App\Declarations\RuleDeclarations;

/**
 * Revises a proposal from its declaration and answers it.
 */
final readonly class ReviseProposalController
{
    #[Dispatches(ReviseRuleProposalCommand::class)]
    public function __invoke(
        ReviseProposalPayload $call,
        RuleDeclarations $declarations,
        CommandBus $commands,
    ): ProposalReceived {
        $declared = $declarations->readOne([...$call->declaration, 'request_id' => $call->proposal]);

        $command = new ReviseRuleProposalCommand($call->proposal, (int) $call->expectedRevision, $declared->proposed);

        return ProposalReceived::from($commands->run($command)->toArray());
    }
}
