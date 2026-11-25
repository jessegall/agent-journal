<?php

declare(strict_types=1);

namespace Domain\Comments\Http\Controllers;

use Domain\Comments\Contracts\CommentResolver;
use App\Contracts\Records\RecordResolver;
use Domain\Comments\Http\Requests\CommentLocationRequest;
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
