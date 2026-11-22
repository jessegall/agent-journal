<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssignmentReference;
use App\Bus\Contracts\CommandBus;
use App\Communication\Calls\MessageNamed;
use App\Communication\Calls\ReleaseMessageClaimCall;
use App\Communication\Commands\ReleaseMessageClaim\ReleaseMessageClaimCommand;

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
