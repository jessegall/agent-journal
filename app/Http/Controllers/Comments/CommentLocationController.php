<?php

declare(strict_types=1);

namespace App\Http\Controllers\Comments;

use App\Comments\Contracts\CommentResolver;
use App\Http\Requests\Comments\CommentLocationRequest;
use App\Records\Contracts\RecordResolver;
use Illuminate\Http\JsonResponse;

final readonly class CommentLocationController
{
    public function __invoke(CommentLocationRequest $request, CommentResolver $comments, RecordResolver $records): JsonResponse
    {
        return new JsonResponse($comments->location($request->target($records), $request->commentId(), $request->selection()));
    }
}
