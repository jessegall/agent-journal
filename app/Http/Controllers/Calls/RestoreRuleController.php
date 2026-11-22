<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Processes\ProposalReceived;
use App\Calls\Processes\RestoreRuleCall;
use App\Commands\RestoreCommandRule\RestoreCommandRuleCommand;
use App\Contracts\CommandBus;

/**
 * Proposes a rule revision again and answers the proposal.
 */
final readonly class RestoreRuleController
{
    public function __invoke(RestoreRuleCall $call, CommandBus $commands): ProposalReceived
    {
        $command = new RestoreCommandRuleCommand(
            $call->rule,
            $call->fromRevision,
            $call->expectedRevision,
            $call->requestKey->value,
        );

        return ProposalReceived::from($commands->run($command)->toArray());
    }
}
