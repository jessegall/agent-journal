<?php

declare(strict_types=1);

namespace App\Http\Controllers\Comments;

use App\Comments\Contracts\CommentReader;
use App\Http\Requests\Comments\ListCommentsRequest;
use App\Records\Contracts\RecordReader;
use Illuminate\Http\JsonResponse;

final readonly class ListCommentsController
{
    public function __invoke(ListCommentsRequest $request, CommentReader $comments, RecordReader $records): JsonResponse
    {
        return new JsonResponse($comments->list($request->target($records), $request->page()));
    }
}
