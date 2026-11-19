<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Communication\ReplyToMessageRequest;
use Illuminate\Http\JsonResponse;

final readonly class ReplyToMessageController
{
    public function __invoke(ReplyToMessageRequest $request, CommandBus $commands): JsonResponse
    {
        $result = $commands->run($request->command());

        return new JsonResponse(['messageId' => $result]);
    }
}
