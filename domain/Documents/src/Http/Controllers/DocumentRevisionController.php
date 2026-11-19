<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Http\Requests\DraftRequest;
use Illuminate\Http\JsonResponse;

final readonly class DocumentRevisionController
{
    public function __invoke(DraftRequest $request, DocumentResolver $documents): JsonResponse
    {
        return new JsonResponse($documents->revision($request->documentNumber(), $request->integer('revision')));
    }
}
