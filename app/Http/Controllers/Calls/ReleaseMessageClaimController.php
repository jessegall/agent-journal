<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\MessageNamed;
use App\Calls\Communication\ReleaseMessageClaimCall;
use App\Commands\ReleaseMessageClaim\ReleaseMessageClaimCommand;
use App\Contracts\CommandBus;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentReference;

/**
 * Gives up the claim on a message, as the claim its caller read.
 */
final readonly class ReleaseMessageClaimController
{
    public function __invoke(ReleaseMessageClaimCall $call, CommandBus $commands): MessageNamed
    {
        $holder = new AssigneeIdentity($call->holderType, $call->holderId);
        $claim = new AssignmentReference($call->claimId, $holder);
        $commands->run(new ReleaseMessageClaimCommand($call->messageId, $claim, $call->reason));

        return MessageNamed::from(['messageId' => $call->messageId]);
    }
}
