<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Communication\SendMessageRequest;
use Illuminate\Http\JsonResponse;

final readonly class SendMessageController
{
    public function __invoke(SendMessageRequest $request, CommandBus $commands): JsonResponse
    {
        $result = $commands->run($request->command());

        return new JsonResponse(['messageId' => $result]);
    }
}
