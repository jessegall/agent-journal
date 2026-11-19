<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Communication\Commands\AskMessage;
use Domain\Chat\Data\MessageInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Sends the composer's message to the chosen session through Chat, then returns to Home on that session (303). Core
 * says whether the session is running and visible, Chat whether its stack may take the message; a refusal of either
 * comes back as a session form error.
 */
final readonly class SendMessageController
{
    /**
     * Asks from the pair of inboxes the conversation showed, so a send keeps its target even when the window has
     * moved on, and returns to Home with the same session chosen.
     */
    public function __invoke(MessageInput $input, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new AskMessage($input->sourceInboxId, $input->destinationInboxId, $input->body));
        $window = ['window' => ['chat.conversation' => ['session' => $input->session]], 'session' => $input->session];

        return $redirect->route('home', $window, 303);
    }
}
