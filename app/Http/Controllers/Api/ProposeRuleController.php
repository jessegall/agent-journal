<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\CommandRules\Commands\ProposeCommandRule\ProposeCommandRuleCommand;
use App\CommandRules\Declarations\RuleDeclarations;
use App\Processes\Api\ProposalReceived;
use App\Processes\Api\ProposeRulePayload;

/**
 * Proposes a rule from its declaration and answers the proposal.
 */
final readonly class ProposeRuleController
{
    #[Dispatches(ProposeCommandRuleCommand::class)]
    public function __invoke(
        ProposeRulePayload $call,
        RuleDeclarations $declarations,
        CommandBus $commands,
    ): ProposalReceived {
        $declared = $declarations->readOne([...$call->declaration, 'request_id' => $call->requestKey->value]);

        $command = new ProposeCommandRuleCommand($call->commandRequest, $declared->requestId, $declared->proposed);

        return ProposalReceived::from($commands->run($command)->toArray());
    }
}
