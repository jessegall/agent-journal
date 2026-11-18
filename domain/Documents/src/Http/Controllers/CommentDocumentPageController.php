<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Documents\Commands\CommentDocument;
use Domain\Documents\Http\Requests\CommentPageRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class CommentDocumentPageController
{
    public function __invoke(CommentPageRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new CommentDocument($request->documentNumber(), $request->body(), $request->anchor()));

        return $redirect->back(303);
    }
}
