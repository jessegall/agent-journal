<?php

declare(strict_types=1);

namespace App\Sharing\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Sharing\RefreshShareScopeRequest;
use App\Sharing\Commands\RefreshShareScope;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Replaces a share's members with the owner's saved preview through the bus and opens the share's page.
 */
final readonly class RefreshShareScopeController
{
    public function __invoke(RefreshShareScopeRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $summary = $commands->run(new RefreshShareScope($request->shareId(), $request->previewId(), $request->previewChecksum(), $request->requestKey()));

        return $redirect->to("/sharing/shares/{$summary->shareId}", 303);
    }
}
