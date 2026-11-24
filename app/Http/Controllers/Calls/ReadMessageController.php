<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\ReadMessageCall;
use App\Commands\Messages\ReadMessage\ReadMessageCommand;
use App\Contracts\Bus\CommandBus;
use App\Data\Messages\MessageView;

/**
 * Reads one message and records the read.
 */
final readonly class ReadMessageController
{
    public function __invoke(ReadMessageCall $call, CommandBus $commands): MessageView
    {
        return $commands->run(new ReadMessageCommand($call->messageId));
    }
}
