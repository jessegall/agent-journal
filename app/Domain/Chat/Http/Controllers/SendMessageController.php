<?php

declare(strict_types=1);

namespace App\Domain\Chat\Http\Controllers;

use App\Core\Agents\Contracts\SessionReader;
use App\Domain\Chat\Contracts\MessageSender;
use App\Domain\Chat\Data\MessageInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Sends the composer's message to the chosen session through Chat, then returns to Home on that session (303). Core
 * says whether the session is running and visible, Chat whether its stack may take the message; a refusal of either
 * comes back as a session form error.
 */
final readonly class SendMessageController
{
    public function __construct(
        private SessionReader $sessions,
        private MessageSender $sendMessage,
        private Redirector $redirect,
    ) {}

    public function __invoke(MessageInput $input): RedirectResponse
    {
        $this->sendMessage->send($input->body, $this->sessions->requireActive((int) $input->session));

        // Back to Home with the session chosen for the chat window and for the sections that read it.
        return $this->redirect->route('home', ['window' => ['chat.conversation' => ['session' => $input->session]], 'session' => $input->session], 303);
    }
}
