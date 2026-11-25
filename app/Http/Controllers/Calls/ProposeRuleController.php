<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Processes\ProposalReceived;
use App\Calls\Processes\ProposeRuleCall;
use App\Commands\CommandRules\ProposeCommandRule\ProposeCommandRuleCommand;
use App\Contracts\Bus\CommandBus;
use App\Declarations\RuleDeclarations;

/**
 * Proposes a rule from its declaration and answers the proposal.
 */
final readonly class ProposeRuleController
{
    public function __invoke(
        ProposeRuleCall $call,
        RuleDeclarations $declarations,
        CommandBus $commands,
    ): ProposalReceived {
        $declared = $declarations->readOne([
            ...$call->declaration,
            'request_id' => $call->requestKey->value,
        ]);
        $command = new ProposeCommandRuleCommand($call->commandRequest, $declared->requestId, $declared->proposed);

        return ProposalReceived::from($commands->run($command)->toArray());
    }
}
