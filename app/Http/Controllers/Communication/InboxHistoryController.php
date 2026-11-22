<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Contracts\ConversationResolver;
use App\Http\Requests\Communication\InboxHistoryRequest;
use Illuminate\Http\JsonResponse;

final readonly class InboxHistoryController
{
    public function __invoke(InboxHistoryRequest $request, ConversationResolver $conversations): JsonResponse
    {
        return new JsonResponse(
            $conversations->history($request->inboxId(), $request->olderCursor(), $request->limit()),
        );
    }
}
