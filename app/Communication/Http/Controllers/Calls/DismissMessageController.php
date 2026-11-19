<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Communication\Calls\DismissMessageCall;
use App\Communication\Calls\MessageNamed;
use App\Communication\Commands\DismissMessage;

/**
 * Dismisses a message with the reason.
 */
final readonly class DismissMessageController
{
    public function __invoke(DismissMessageCall $call, CommandBus $commands): MessageNamed
    {
        $commands->run(new DismissMessage($call->messageId, $call->reason));

        return MessageNamed::from(['messageId' => $call->messageId]);
    }
}
