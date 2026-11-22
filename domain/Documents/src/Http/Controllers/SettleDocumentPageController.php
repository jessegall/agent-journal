<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use App\Contracts\Bus\CommandBus;
use Domain\Documents\Commands\SettleDocument\SettleDocumentCommand;
use Domain\Documents\Http\Requests\SettleRecordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class SettleDocumentPageController
{
    public function __invoke(SettleRecordRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new SettleDocumentCommand($request->documentNumber(), $request->revision(), $request->reason()));

        return $redirect->back(303);
    }
}
