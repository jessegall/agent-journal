<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\MessageNamed;
use App\Calls\Communication\RequireMessageAnswerCall;
use App\Commands\RequireMessageAnswer\RequireMessageAnswerCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Marks a message as one that must be answered.
 */
final readonly class RequireMessageAnswerController
{
    public function __invoke(RequireMessageAnswerCall $call, CommandBus $commands): MessageNamed
    {
        $commands->run(new RequireMessageAnswerCommand($call->messageId));

        return MessageNamed::from(['messageId' => $call->messageId]);
    }
}
