<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\MessageNamed;
use App\Calls\Communication\SelectMessageCall;
use App\Commands\SelectMessage\SelectMessageCommand;
use App\Contracts\Bus\CommandBus;

final readonly class SelectMessageController
{
    public function __invoke(SelectMessageCall $call, CommandBus $commands): MessageNamed
    {
        $messageId = $commands->run(new SelectMessageCommand($call->messageId));

        return MessageNamed::from(['messageId' => $messageId]);
    }
}
