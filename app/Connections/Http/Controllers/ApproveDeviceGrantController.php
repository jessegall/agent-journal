<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Connections\Commands\ApproveDeviceGrant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * The owner approves a device code from its approval page.
 */
final readonly class ApproveDeviceGrantController
{
    public function __invoke(string $code, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new ApproveDeviceGrant($code));

        return $redirect->back(303);
    }
}
