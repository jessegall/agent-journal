<?php

declare(strict_types=1);

namespace App\Sharing\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Sharing\CreateShareRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Confirms the owner's saved preview into a share through the bus and opens the new share's page.
 */
final readonly class CreateShareController
{
    public function __invoke(CreateShareRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $summary = $commands->run($request->command());

        return $redirect->to("/sharing/shares/{$summary->shareId}", 303);
    }
}
