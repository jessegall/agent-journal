<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Processes\Calls\ProposalReceived;
use App\Processes\Calls\ProposeRuleCall;
use App\Processes\Commands\ProposeCommandRule;
use App\Processes\Declarations\RuleDeclarations;

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
        $declared = $declarations->readOne([...$call->declaration, 'request_id' => $call->requestKey->value]);
        $command = new ProposeCommandRule($call->commandRequest, $declared->requestId, $declared->proposed);

        return ProposalReceived::from($commands->run($command)->toArray());
    }
}
