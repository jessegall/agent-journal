<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Communication\Calls\ReleaseSpeechCall;
use App\Communication\Calls\MessageNamed;
use App\Communication\Commands\ReleaseSpeech;

/**
 * Gives up your claim on a turn to speak.
 */
final readonly class ReleaseSpeechController
{
    public function __invoke(ReleaseSpeechCall $call, CommandBus $commands): MessageNamed
    {
        $commands->run(new ReleaseSpeech($call->inboxId, $call->rootId));

        return MessageNamed::from(['messageId' => $call->rootId]);
    }
}
