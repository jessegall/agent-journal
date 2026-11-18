<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Documents\Commands\CloseDocument;
use Domain\Documents\Http\Requests\DraftRequest;
use Illuminate\Http\JsonResponse;

final readonly class CloseDocumentController
{
    public function __invoke(DraftRequest $request, CommandBus $commands): JsonResponse
    {
        return new JsonResponse($commands->run(new CloseDocument($request->target())));
    }
}
