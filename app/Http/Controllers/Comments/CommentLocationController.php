<?php

declare(strict_types=1);

namespace App\Http\Controllers\Comments;

use App\Contracts\Records\CommentResolver;
use App\Contracts\Records\RecordResolver;
use App\Http\Requests\Comments\CommentLocationRequest;
use Illuminate\Http\JsonResponse;

final readonly class CommentLocationController
{
    public function __invoke(
        CommentLocationRequest $request,
        CommentResolver $comments,
        RecordResolver $records,
    ): JsonResponse {
        return new JsonResponse(
            $comments->location($request->target($records), $request->commentId(), $request->selection()),
        );
    }
}
