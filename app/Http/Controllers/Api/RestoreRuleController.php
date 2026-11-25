<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\ProposalReceived;
use App\Api\Processes\RestoreRulePayload;
use App\Commands\CommandRules\RestoreCommandRule\RestoreCommandRuleCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Proposes a rule revision again and answers the proposal.
 */
final readonly class RestoreRuleController
{
    public function __invoke(RestoreRulePayload $call, CommandBus $commands): ProposalReceived
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
