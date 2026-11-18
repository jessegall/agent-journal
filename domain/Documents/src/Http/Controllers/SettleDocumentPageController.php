<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Documents\Commands\SettleDocument;
use Domain\Documents\Http\Requests\SettleRecordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class SettleDocumentPageController
{
    public function __invoke(SettleRecordRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new SettleDocument($request->documentNumber(), $request->revision(), $request->reason()));

        return $redirect->back(303);
    }
}
