<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Chat\Commands\DockSource;
use Domain\Chat\Data\DockAnswerData;
use Domain\Chat\Data\DockInput;
use Domain\Chat\Support\DockRequests;

final readonly class DockController
{
    /**
     * Docks the source in the conversation with the agent and answers what came of it; a retry under the same key
     * answers the first time.
     */
    public function __invoke(DockInput $input, CommandBus $commands, DockRequests $requests): DockAnswerData
    {
        $conversation = $requests->conversationWith($input->agent);

        return DockAnswerData::fromDockResult(
            $commands->run(new DockSource($conversation->id, $input->type, $input->id, $input->presentation)),
        );
    }
}
