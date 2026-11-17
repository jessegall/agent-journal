<?php

declare(strict_types=1);

namespace App\Domain\Web\Http\Controllers;

use App\Core\Agents\Models\AgentSession;
use App\Core\Hooks\StackTarget;
use App\Domain\Chat\Actions\SendMessage;
use App\Domain\Web\Data\MessageInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;
use Illuminate\Validation\ValidationException;

/**
 * Sends the composer's message to the chosen session through Chat, then returns to Home on that session (303).
 * Chat decides whether the session may take it; a refused target comes back as a form error.
 */
final readonly class SendMessageController
{
    public function __construct(
        private SendMessage $sendMessage,
        private Redirector $redirect,
    ) {}

    public function __invoke(MessageInput $input): RedirectResponse
    {
        $session = AgentSession::query()->find((int) $input->session) ?? throw ValidationException::withMessages(['session' => 'This agent session is not running.']);

        $this->sendMessage->send($input->body, new StackTarget($session->agent_id, $session->id));

        return $this->redirect->route('home', ['session' => $input->session], 303);
    }
}
