<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Processes\Calls\ProposalReceived;
use App\Processes\Calls\RestoreRuleCall;
use App\Processes\Commands\RestoreCommandRule\RestoreCommandRuleCommand;

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
