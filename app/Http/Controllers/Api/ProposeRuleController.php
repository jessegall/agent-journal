<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\ProposalReceived;
use App\Api\Processes\ProposeRulePayload;
use App\Attributes\Bus\Dispatches;
use App\Commands\CommandRules\ProposeCommandRule\ProposeCommandRuleCommand;
use App\Contracts\Bus\CommandBus;
use App\Declarations\RuleDeclarations;

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
