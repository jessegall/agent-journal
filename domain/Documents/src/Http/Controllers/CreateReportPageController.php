<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Projects\Contracts\ProjectDestination;
use App\Records\Contracts\RecordResolver;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\Http\Requests\CreateRecordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class CreateReportPageController
{
    #[Dispatches(CreateReportCommand::class)]
    public function __invoke(
        CreateRecordRequest $request,
        CommandBus $commands,
        RecordResolver $records,
        ProjectDestination $destination,
        Redirector $redirect,
    ): RedirectResponse {
        $commands->run(
            new CreateReportCommand(
                $request->title(),
                $request->abstract(),
                $request->body(),
                $destination->projectFor($request->chosenProject()),
                $request->about($records),
            ),
        );

        return $redirect->back(303);
    }
}
