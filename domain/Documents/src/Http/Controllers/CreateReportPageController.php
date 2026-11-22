<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use App\Contracts\CommandBus;
use App\Contracts\RecordResolver;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\Http\Requests\CreateRecordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class CreateReportPageController
{
    public function __invoke(
        CreateRecordRequest $request,
        CommandBus $commands,
        RecordResolver $records,
        Redirector $redirect,
    ): RedirectResponse {
        $commands->run(
            new CreateReportCommand($request->title(), $request->abstract(), $request->body(), $request->about($records)),
        );

        return $redirect->back(303);
    }
}
