<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\MessageNamed;
use App\Calls\Communication\ReleaseSpeechCall;
use App\Commands\ReleaseSpeech\ReleaseSpeechCommand;
use App\Contracts\CommandBus;

/**
 * Gives up your claim on a turn to speak.
 */
final readonly class ReleaseSpeechController
{
    public function __invoke(ReleaseSpeechCall $call, CommandBus $commands): MessageNamed
    {
        $commands->run(new ReleaseSpeechCommand($call->inboxId, $call->rootId));

        return MessageNamed::from(['messageId' => $call->rootId]);
    }
}
