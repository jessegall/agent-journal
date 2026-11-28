<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Agents\AgentStartOnMessage;
use App\Agents\Commands\StartProfileMain\StartProfileMainCommand;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Messages\Commands\SendMessage\SendMessageCommand;
use Domain\Chat\Data\MessageInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Sends the composer's message into the chat the window showed, as a reply when it names the message it answers.
 * With an agent chosen, the agent must still run the session the user saw, and one with no session is started or
 * resumed first.
 */
final readonly class SendMessageController
{
    #[Dispatches(SendMessageCommand::class)]
    #[Dispatches(StartProfileMainCommand::class)]
    public function __invoke(
        MessageInput $input,
        AgentStartOnMessage $start,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        if ($input->agent !== null) {
            $start->prepare($input->agent, $input->expectedSessionId);
        }

        $commands->run(new SendMessageCommand($input->inboxId, $input->body, $input->targetMessageNumber));

        return $redirect->back(303);
    }
}
