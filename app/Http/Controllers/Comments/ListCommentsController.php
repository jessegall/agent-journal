<?php

declare(strict_types=1);

namespace App\Http\Controllers\Comments;

use App\Contracts\Records\CommentResolver;
use App\Contracts\Records\RecordResolver;
use App\Http\Requests\Comments\ListCommentsRequest;
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
