<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Communication\Commands\ReadMessages;
use Domain\Chat\Data\ReadShownInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class ReadShownController
{
    /**
     * Marks the shown incoming messages read for everyone at the inbox, and takes up the questions among them.
     */
    public function __invoke(ReadShownInput $input, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new ReadMessages($input->inboxId, $input->messageIds));
        $window = ['window' => ['chat.conversation' => ['session' => $input->session]], 'session' => $input->session];

        return $redirect->route('home', $window, 303);
    }
}
