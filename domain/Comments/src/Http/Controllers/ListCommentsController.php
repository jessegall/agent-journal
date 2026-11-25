<?php

declare(strict_types=1);

namespace Domain\Comments\Http\Controllers;

use App\Contracts\Records\RecordResolver;
use Domain\Comments\Contracts\CommentResolver;
use Domain\Comments\Http\Requests\ListCommentsRequest;
use Illuminate\Http\JsonResponse;

final readonly class ListCommentsController
{
    public function __invoke(
        ListCommentsRequest $request,
        CommentResolver $comments,
        RecordResolver $records,
    ): JsonResponse {
        return new JsonResponse($comments->list($request->target($records), $request->page()));
    }
}
