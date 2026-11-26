<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use Domain\Chat\Commands\React\ReactCommand;
use Domain\Chat\Data\ReactInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Reacts to a message of the chat with one emoji, which is a reply to it.
 */
final readonly class ReactController
{
    #[Dispatches(ReactCommand::class)]
    public function __invoke(ReactInput $input, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new ReactCommand($input->messageId, $input->emoji));

        return $redirect->back(303);
    }
}
