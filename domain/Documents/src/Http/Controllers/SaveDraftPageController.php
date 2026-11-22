<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use App\Contracts\CommandBus;
use Domain\Documents\Commands\ChangeDocumentDetails\ChangeDocumentDetailsCommand;
use Domain\Documents\Commands\ReplaceDocumentBody\ReplaceDocumentBodyCommand;
use Domain\Documents\Http\Requests\DraftPageRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Saves the editor's text: the title and abstract, then the body, each as the next version of the draft.
 */
final readonly class SaveDraftPageController
{
    public function __invoke(DraftPageRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $saved = $commands->run(new ChangeDocumentDetailsCommand($request->target(), $request->title(), $request->abstract()));

        $commands->run(
            new ReplaceDocumentBodyCommand(
                $saved->target(),
                $request->body(),
            ),
        );

        return $redirect->back(303);
    }
}
