<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Contracts\ConversationResolver;
use App\Http\Requests\Communication\InboxCountsRequest;
use Illuminate\Http\JsonResponse;

final readonly class InboxCountsController
{
    public function __invoke(InboxCountsRequest $request, ConversationResolver $conversations): JsonResponse
    {
        return new JsonResponse($conversations->counts($request->inboxId()));
    }
}
