<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Attributes\Bus\Dispatches;
use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Sessions\AgentDirectory;
use Domain\Chat\Data\MessageInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Sends the composer's message into the chat the window showed, as a reply when it names the message it answers.
 * With an agent chosen, the agent must still run the session the user saw.
 */
final readonly class SendMessageController
{
    #[Dispatches(SendMessageCommand::class)]
    public function __invoke(
        MessageInput $input,
        AgentDirectory $agents,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        if ($input->agent !== null) {
            $agents->visibleAgent($input->agent)->assertRuns($input->expectedSessionId);
        }

        $commands->run(new SendMessageCommand($input->inboxId, $input->body, $input->targetMessageNumber));

        return $redirect->back(303);
    }
}
