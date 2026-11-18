<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Http\Requests\ShowRecordRequest;
use Illuminate\Http\JsonResponse;

final readonly class ShowDocumentController
{
    public function __invoke(ShowRecordRequest $request, DocumentReader $documents): JsonResponse
    {
        return new JsonResponse($documents->read($request->number(), $request->selection(), $request->revision(), $request->expectedRevision()));
    }
}
