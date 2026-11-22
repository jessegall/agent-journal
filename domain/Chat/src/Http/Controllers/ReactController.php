<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Contracts\CommandBus;
use Domain\Chat\Commands\ToggleReaction\ToggleReactionCommand;
use Domain\Chat\Data\ReactInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class ReactController
{
    /**
     * Adds the viewer's reaction to a message, or takes it back, and shows the chat again.
     */
    public function __invoke(ReactInput $input, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new ToggleReactionCommand($input->inboxId, $input->messageId, $input->emoji));

        return $redirect->back(303);
    }
}
