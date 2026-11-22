<?php

declare(strict_types=1);

namespace App\Http\Controllers\Comments;

use App\Contracts\CommandBus;
use App\Contracts\RecordResolver;
use App\Http\Requests\Comments\PostCommentRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class PostCommentController
{
    public function __invoke(
        PostCommentRequest $request,
        CommandBus $commands,
        RecordResolver $records,
        Redirector $redirect,
    ): JsonResponse|RedirectResponse {
        $commentId = $commands->run($request->command($records));

        if (! $request->expectsJson()) {
            return $redirect->back(303);
        }

        return new JsonResponse(['comment' => $commentId]);
    }
}
