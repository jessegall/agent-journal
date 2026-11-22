<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Membership;

use App\Contracts\Bus\CommandBus;
use Domain\Chat\Commands\CloseChat\CloseChatCommand;
use Domain\Chat\Data\ChatInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class CloseChatController
{
    /**
     * Closes a chat the asker owns. The command rechecks every rule on submission.
     */
    public function __invoke(
        ChatInput $input,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $commands->run(new CloseChatCommand($input->inboxId));

        return $redirect->back(303);
    }
}
