<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Contracts\ConversationResolver;
use App\Http\Requests\Communication\WakeStatusRequest;
use Illuminate\Http\JsonResponse;

final readonly class WakeStatusController
{
    public function __invoke(WakeStatusRequest $request, ConversationResolver $conversations): JsonResponse
    {
        return new JsonResponse($conversations->wakeStatus($request->messageId()));
    }
}
