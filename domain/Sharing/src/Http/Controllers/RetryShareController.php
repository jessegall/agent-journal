<?php

declare(strict_types=1);

namespace Domain\Sharing\Http\Controllers;

use Domain\Sharing\Commands\RetryShare\RetryShareCommand;
use App\Contracts\Bus\CommandBus;
use Domain\Sharing\Http\Requests\ShareActionRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Asks the gateway to open a pending or failed share again through the bus and returns to its page.
 */
final readonly class RetryShareController
{
    public function __invoke(ShareActionRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new RetryShareCommand($request->shareId(), $request->requestKey()));

        return $redirect->back(303);
    }
}
