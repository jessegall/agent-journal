<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Communication\Calls\MessageNamed;
use App\Communication\Calls\SelectMessageCall;
use App\Communication\Commands\SelectMessage\SelectMessageCommand;

final readonly class SelectMessageController
{
    public function __invoke(SelectMessageCall $call, CommandBus $commands): MessageNamed
    {
        $messageId = $commands->run(new SelectMessageCommand($call->messageId));

        return MessageNamed::from(['messageId' => $messageId]);
    }
}
