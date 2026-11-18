<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Documents\Commands\OpenDocument;
use Domain\Documents\Http\Requests\DraftRequest;
use Illuminate\Http\JsonResponse;

final readonly class OpenDocumentController
{
    public function __invoke(DraftRequest $request, CommandBus $commands): JsonResponse
    {
        return new JsonResponse($commands->run(new OpenDocument($request->documentNumber())));
    }
}
