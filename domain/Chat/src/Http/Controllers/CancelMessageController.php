<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Communication\Commands\DismissMessage\DismissMessageCommand;
use Domain\Chat\Data\CancelInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class CancelMessageController
{
    /**
     * Cancels a waiting message with a reason; Core decides whether the reader may, as author, member or inspector.
     */
    public function __invoke(CancelInput $input, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new DismissMessageCommand($input->messageId, $input->reason));

        return $redirect->back(303);
    }
}
