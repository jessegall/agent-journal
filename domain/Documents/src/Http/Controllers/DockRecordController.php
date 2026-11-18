<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Documents\Commands\DockDocument;
use Domain\Documents\Commands\DockReport;
use Domain\Documents\Http\Requests\DockRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class DockRecordController
{
    public function __invoke(DockRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run($request->isReport() ? new DockReport($request->number(), $request->sessionId()) : new DockDocument($request->number(), $request->sessionId()));

        return $redirect->back(303);
    }
}
