<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\CommandRules\Commands\ReviseRuleProposal\ReviseRuleProposalCommand;
use App\CommandRules\Declarations\RuleDeclarations;
use App\Processes\Api\ProposalReceived;
use App\Processes\Api\ReviseProposalPayload;

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
