<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Communication\Calls\MessageNamed;
use App\Communication\Calls\RequireMessageAnswerCall;
use App\Communication\Commands\RequireMessageAnswer;

/**
 * Marks a message as one that must be answered.
 */
final readonly class RequireMessageAnswerController
{
    public function __invoke(RequireMessageAnswerCall $call, CommandBus $commands): MessageNamed
    {
        $commands->run(new RequireMessageAnswer($call->messageId));

        return MessageNamed::from(['messageId' => $call->messageId]);
    }
}
