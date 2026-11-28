<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Agents\Commands\StartProfileMain\StartProfileMainCommand;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\RequestKey;
use App\Messages\Commands\SendMessage\SendMessageCommand;
use App\Sessions\Contracts\AgentDirectory;
use Domain\Chat\Data\MessageInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Sends the composer's message into the chat the window showed, as a reply when it names the message it answers.
 * With an agent chosen, the agent must still run the session the user saw; an agent with no session is started or
 * resumed first, under the message's request key, and reads the message once it runs.
 */
final readonly class SendMessageController
{
    #[Dispatches(StartProfileMainCommand::class)]
    #[Dispatches(SendMessageCommand::class)]
    public function __invoke(
        MessageInput $input,
        AgentDirectory $agents,
        CommandBus $commands,
        RequestKey $requestKey,
        Redirector $redirect,
    ): RedirectResponse {
        if ($input->agent !== null) {
            $agent = $agents->visibleAgent($input->agent);
            $agent->assertRuns($input->expectedSessionId);

            if ($agent->isStartable()) {
                $commands->run(StartProfileMainCommand::onMessage(
                    $requestKey->requireFor(StartProfileMainCommand::class),
                    $agent,
                ));
            }
        }

        $commands->run(new SendMessageCommand($input->inboxId, $input->body, $input->targetMessageNumber));

        return $redirect->back(303);
    }
}
