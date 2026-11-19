<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Communication\Commands\ReplyToMessage;
use Domain\Chat\Data\ReplyInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class ReplyController
{
    /**
     * Replies at the version the person saw; a message that changed since is refused and the page shows it anew.
     */
    public function __invoke(ReplyInput $input, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new ReplyToMessage($input->messageId, $input->stateVersion, $input->body));
        $window = ['window' => ['chat.conversation' => ['session' => $input->session]], 'session' => $input->session];

        return $redirect->route('home', $window, 303);
    }
}
