<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Http\Requests\DraftRequest;
use Illuminate\Http\JsonResponse;

final readonly class DocumentRevisionsController
{
    public function __invoke(DraftRequest $request, DocumentReader $documents): JsonResponse
    {
        return new JsonResponse(['revisions' => $documents->revisions($request->documentNumber(), max(1, $request->integer('page', 1)))]);
    }
}
