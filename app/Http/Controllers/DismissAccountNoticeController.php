<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Commands\DismissAccountNotice\DismissAccountNoticeCommand;
use App\Contracts\Bus\CommandBus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Dismisses an account notice through the bus and returns to the page it was dismissed from.
 */
final readonly class DismissAccountNoticeController
{
    public function __invoke(string $notice, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new DismissAccountNoticeCommand($notice));

        return $redirect->back(303);
    }
}
