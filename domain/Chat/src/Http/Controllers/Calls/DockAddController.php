<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Calls;

use App\Contracts\Bus\CommandBus;
use Domain\Chat\Calls\DockAddCall;
use Domain\Chat\Commands\DockSource\DockSourceCommand;
use Domain\Chat\Data\DockAnswerData;

/**
 * Docks a source for a journal caller through the same command the chat uses, and answers its receipt.
 */
final readonly class DockAddController
{
    public function __invoke(DockAddCall $call, CommandBus $commands): DockAnswerData
    {
        return DockAnswerData::fromDockResult($commands->run(new DockSourceCommand($call->chat, $call->type, $call->id)));
    }
}
