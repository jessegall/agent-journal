<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Bus\CommandBus;
use Domain\Documents\Commands\CloseDocument\CloseDocumentCommand;
use Domain\Documents\Http\Requests\DraftPageRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class CloseDraftPageController
{
    #[Dispatches(CloseDocumentCommand::class)]
    public function __invoke(DraftPageRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new CloseDocumentCommand($request->target()));

        return $redirect->back(303);
    }
}
