<?php

declare(strict_types=1);

namespace Domain\Sharing\Http\Controllers;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Bus\CommandBus;
use Domain\Sharing\Commands\RevokeShare\RevokeShareCommand;
use Domain\Sharing\Http\Requests\ShareActionRequest;
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
