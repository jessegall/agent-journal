<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\ClaimSpeechCall;
use App\Calls\Communication\SpeechClaim;
use App\Commands\Messages\ClaimSpeech\ClaimSpeechCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Claims your turn to speak on one user message of a chat.
 */
final readonly class ClaimSpeechController
{
    public function __invoke(ClaimSpeechCall $call, CommandBus $commands): SpeechClaim
    {
        $token = $commands->run(new ClaimSpeechCommand($call->inboxId, $call->rootId, $call->batchId, $call->grant));

        return SpeechClaim::from(['rootId' => $call->rootId, 'claimToken' => $token]);
    }
}
