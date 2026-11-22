<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use App\Contracts\CommandBus;
use Domain\Documents\Commands\CloseReport\CloseReportCommand;
use Domain\Documents\Http\Requests\SettleRecordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class SettleReportPageController
{
    public function __invoke(SettleRecordRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new CloseReportCommand((string) $request->reportNumber(), $request->reason()));

        return $redirect->back(303);
    }
}
