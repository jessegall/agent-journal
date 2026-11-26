<?php

declare(strict_types=1);

namespace App\Http\Controllers\Sharing;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Sharing\ShareActionRequest;
use App\Sharing\Commands\RevokeShare\RevokeShareCommand;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Revokes a share or dismisses a proposal through the bus and returns to its page.
 */
final readonly class RevokeShareController
{
    #[Dispatches(RevokeShareCommand::class)]
    public function __invoke(ShareActionRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new RevokeShareCommand($request->shareId(), $request->requestKey()));

        return $redirect->back(303);
    }
}
