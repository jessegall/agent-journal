<?php

declare(strict_types=1);

namespace App\Http\Controllers\Sharing;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Sharing\ShareActionRequest;
use App\Sharing\Commands\RetryShare\RetryShareCommand;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Asks the gateway to open a pending or failed share again through the bus and returns to its page.
 */
final readonly class RetryShareController
{
    #[Dispatches(RetryShareCommand::class)]
    public function __invoke(ShareActionRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new RetryShareCommand($request->shareId(), $request->requestKey()));

        return $redirect->back(303);
    }
}
