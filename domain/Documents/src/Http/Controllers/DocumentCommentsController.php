<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Http\Requests\ShowRecordRequest;
use Illuminate\Http\JsonResponse;

final readonly class DocumentCommentsController
{
    public function __invoke(ShowRecordRequest $request, DocumentReader $records): JsonResponse
    {
        return new JsonResponse(['comments' => $records->comments($request->number(), $request->page())]);
    }
}
