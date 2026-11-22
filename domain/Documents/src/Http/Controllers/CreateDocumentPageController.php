<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Records\Contracts\RecordResolver;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Http\Requests\CreateRecordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class CreateDocumentPageController
{
    public function __invoke(
        CreateRecordRequest $request,
        CommandBus $commands,
        RecordResolver $records,
        Redirector $redirect,
    ): RedirectResponse {
        $commands->run(
            new CreateDocumentCommand($request->title(), $request->abstract(), $request->body(), $request->about($records)),
        );

        return $redirect->back(303);
    }
}
