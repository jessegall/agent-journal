<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Projects\ProjectDestination;
use App\Contracts\Records\RecordResolver;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Http\Requests\CreateRecordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class CreateDocumentPageController
{
    #[Dispatches(CreateDocumentCommand::class)]
    public function __invoke(
        CreateRecordRequest $request,
        CommandBus $commands,
        RecordResolver $records,
        ProjectDestination $destination,
        Redirector $redirect,
    ): RedirectResponse {
        $commands->run(
            new CreateDocumentCommand(
                $request->title(),
                $request->abstract(),
                $request->body(),
                $destination->ownerFor($request->chosenProject())->key(),
                $request->about($records),
            ),
        );

        return $redirect->back(303);
    }
}
