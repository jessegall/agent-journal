<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Communication\Contracts\ConversationResolver;
use App\Http\Requests\Communication\MessagesBetweenRequest;
use Illuminate\Http\JsonResponse;

final readonly class MessagesBetweenController
{
    public function __invoke(MessagesBetweenRequest $request, ConversationResolver $conversations): JsonResponse
    {
        return new JsonResponse($conversations->between(
            $request->firstInboxId(),
            $request->secondInboxId(),
            $request->olderCursor(),
            $request->limit(),
        ));
    }
}
