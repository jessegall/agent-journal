<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Http\Requests\DraftPageRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class OpenDocumentPageController
{
    public function __invoke(DraftPageRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new OpenDocumentCommand((string) $request->documentNumber()));

        return $redirect->back(303);
    }
}
