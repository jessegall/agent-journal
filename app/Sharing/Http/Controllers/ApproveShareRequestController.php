<?php

declare(strict_types=1);

namespace App\Sharing\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Sharing\ApproveProposalRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Approves an agent's proposal from the owner's saved preview through the bus and opens the share's page.
 */
final readonly class ApproveShareRequestController
{
    public function __invoke(ApproveProposalRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $summary = $commands->run($request->command());

        return $redirect->to("/sharing/shares/{$summary->shareId}", 303);
    }
}
