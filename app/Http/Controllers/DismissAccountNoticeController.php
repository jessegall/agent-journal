<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Attributes\Bus\Dispatches;
use App\Commands\Accounts\DismissAccountNotice\DismissAccountNoticeCommand;
use App\Contracts\Bus\CommandBus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Dismisses an account notice through the bus and returns to the page it was dismissed from.
 */
final readonly class DismissAccountNoticeController
{
    #[Dispatches(DismissAccountNoticeCommand::class)]
    public function __invoke(string $notice, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new DismissAccountNoticeCommand($notice));

        return $redirect->back(303);
    }
}
