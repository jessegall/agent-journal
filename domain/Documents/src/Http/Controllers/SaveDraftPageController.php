<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Commands\ChangeDocumentDetails;
use Domain\Documents\Commands\ReplaceDocumentBody;
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
        $saved = $commands->run(new ChangeDocumentDetails($request->target(), $request->title(), $request->abstract()));
        $commands->run(
            new ReplaceDocumentBody(
                new DraftTarget($saved->documentNumber, $saved->token, $saved->version),
                $request->body(),
            ),
        );

        return $redirect->back(303);
    }
}
