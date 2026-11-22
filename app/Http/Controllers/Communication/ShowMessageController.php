<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Contracts\Chat\ConversationResolver;
use App\Http\Requests\Communication\ShowMessageRequest;
use Illuminate\Http\JsonResponse;

final readonly class ShowMessageController
{
    public function __invoke(ShowMessageRequest $request, ConversationResolver $conversations): JsonResponse
    {
        return new JsonResponse($conversations->detail($request->messageId()));
    }
}
