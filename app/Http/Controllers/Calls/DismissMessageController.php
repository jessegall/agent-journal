<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\DismissMessageCall;
use App\Calls\Communication\MessageNamed;
use App\Commands\DismissMessage\DismissMessageCommand;
use App\Contracts\CommandBus;

/**
 * Dismisses a message with the reason.
 */
final readonly class DismissMessageController
{
    public function __invoke(DismissMessageCall $call, CommandBus $commands): MessageNamed
    {
        $commands->run(new DismissMessageCommand($call->messageId, $call->reason));

        return MessageNamed::from(['messageId' => $call->messageId]);
    }
}
