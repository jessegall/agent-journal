<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Api;

use App\Contracts\Bus\CommandBus;
use Domain\Chat\Api\DockRemovePayload;
use Domain\Chat\Commands\UndockSource\UndockSourceCommand;
use Domain\Chat\Data\DockAnswerData;
use Domain\Chat\Models\DockPlacement;
use Domain\Chat\Support\DockRequests;
use Domain\Chat\Values\DockResult;

/**
 * Undocks a placement for a journal caller through the same command the chat uses; a placement that is not in the
 * conversation answers that nothing was there.
 */
final readonly class DockRemoveController
{
    public function __invoke(DockRemovePayload $call, CommandBus $commands, DockRequests $requests): DockAnswerData
    {
        $inbox = $requests->chosenInbox($call->chat);
        $placement = DockPlacement::query()->inInbox($inbox)->whereKey($call->placement)->first();

        if ($placement === null) {
            return DockAnswerData::fromDockResult(DockResult::unavailable());
        }

        return DockAnswerData::fromDockResult($commands->run(new UndockSourceCommand(
            $call->chat,
            $placement->id,
            $placement->dockable_type,
            $placement->dockable_id,
        )));
    }
}
