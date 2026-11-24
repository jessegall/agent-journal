<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Commands\TakeNextMessages\TakeNextMessagesCommand;
use App\Contracts\Bus\CommandBus;
use Domain\Chat\Data\TakeNextInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class TakeNextController
{
    /**
     * Claims the oldest question nobody has claimed in the inbox, then shows the Inbox page again.
     */
    public function __invoke(TakeNextInput $input, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new TakeNextMessagesCommand($input->inboxId));

        return $redirect->back(303);
    }
}
