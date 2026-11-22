<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Communication\Commands\ReadMessages\ReadMessagesCommand;
use Domain\Chat\Data\ReadShownInput;
use Domain\Chat\Http\Requests\ConversationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class ReadShownController
{
    /**
     * Marks the shown incoming messages read for everyone at the inbox, and takes up the questions among them.
     */
    public function __invoke(ReadShownInput $input, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new ReadMessagesCommand($input->inboxId, $input->messageIds));
        $home = $redirect->getUrlGenerator()->route('home', ConversationRequest::queryFor($input->agent), false);

        // The page that showed the messages, Home or Chat's own, is shown again.
        return $redirect->back(303, [], $home);
    }
}
