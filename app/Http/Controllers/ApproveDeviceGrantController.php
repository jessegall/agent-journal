<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Commands\Projects\ApproveDeviceGrant\ApproveDeviceGrantCommand;
use App\Contracts\Bus\CommandBus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * The owner approves a device code from its approval page.
 */
final readonly class ApproveDeviceGrantController
{
    public function __invoke(string $code, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new ApproveDeviceGrantCommand($code));

        return $redirect->back(303);
    }
}
