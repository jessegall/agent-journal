<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Http\Requests\ShowRecordRequest;
use Illuminate\Http\JsonResponse;

final readonly class ShowDocumentController
{
    public function __invoke(ShowRecordRequest $request, DocumentResolver $documents): JsonResponse
    {
        return new JsonResponse($documents->read($request->number(), $request->selection(), $request->revision(), $request->expectedRevision()));
    }
}
