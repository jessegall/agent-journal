<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Communication\Calls\ClaimSpeechCall;
use App\Communication\Calls\SpeechClaim;
use App\Communication\Commands\ClaimSpeech;

/**
 * Claims your turn to speak on one user message of a chat.
 */
final readonly class ClaimSpeechController
{
    public function __invoke(ClaimSpeechCall $call, CommandBus $commands): SpeechClaim
    {
        $token = $commands->run(new ClaimSpeech($call->inboxId, $call->rootId, $call->batchId, $call->grant));

        return SpeechClaim::from(['rootId' => $call->rootId, 'claimToken' => $token]);
    }
}
