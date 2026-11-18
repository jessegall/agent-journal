<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Communication\Commands\SendMessage;
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
    public function __invoke(MessageInput $input, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new SendMessage($input->body, (string) $input->session));

        // Back to Home with the session chosen for the chat window and for the sections that read it.
        return $redirect->route('home', ['window' => ['chat.conversation' => ['session' => $input->session]], 'session' => $input->session], 303);
    }
}
