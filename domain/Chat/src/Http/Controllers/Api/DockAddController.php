<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Api;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Bus\CommandBus;
use Domain\Chat\Api\DockAddPayload;
use Domain\Chat\Commands\DockSource\DockSourceCommand;
use Domain\Chat\Data\DockAnswerData;

/**
 * Docks a source for a journal caller through the same command the chat uses, and answers its receipt.
 */
final readonly class DockAddController
{
    #[Dispatches(DockSourceCommand::class)]
    public function __invoke(DockAddPayload $call, CommandBus $commands): DockAnswerData
    {
        return DockAnswerData::fromDockResult(
            $commands->run(new DockSourceCommand($call->chat, $call->type, $call->id)),
        );
    }
}
