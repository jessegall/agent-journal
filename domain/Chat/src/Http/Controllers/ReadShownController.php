<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Commands\Messages\ReadMessage\ReadMessageCommand;
use App\Contracts\Bus\CommandBus;
use Domain\Chat\Data\ReadShownInput;
use Domain\Chat\Http\Requests\ConversationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class ReadShownController
{
    /**
     * Records that the viewer read each message the page showed it.
     */
    public function __invoke(ReadShownInput $input, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        foreach ($input->messageIds as $messageId) {
            $commands->run(new ReadMessageCommand($messageId));
        }

        $home = $redirect->getUrlGenerator()->route('home', ConversationRequest::queryFor($input->agent), false);

        // The page that showed the messages, Home or Chat's own, is shown again.
        return $redirect->back(303, [], $home);
    }
}
