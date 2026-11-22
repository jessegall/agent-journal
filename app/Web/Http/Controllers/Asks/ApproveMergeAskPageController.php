<?php

declare(strict_types=1);

namespace App\Web\Http\Controllers\Asks;

use App\Bus\Contracts\CommandBus;
use App\Web\Http\Requests\ApproveMergeAskRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * The holder approves a merge ask's merge from its page, at the version the page showed; a stale version or another
 * holder is refused and the page reads the ask again.
 */
final readonly class ApproveMergeAskPageController
{
    public function __invoke(
        ApproveMergeAskRequest $request,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $commands->run($request->command());

        return $redirect->back(303);
    }
}
