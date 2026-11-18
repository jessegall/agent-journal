<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Http\Requests\CreateRecordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class CreateDocumentPageController
{
    public function __invoke(CreateRecordRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new CreateDocument($request->title(), $request->abstract(), $request->body()));

        return $redirect->back(303);
    }
}
