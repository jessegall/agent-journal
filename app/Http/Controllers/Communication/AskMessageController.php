<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Communication\AskMessageRequest;
use Illuminate\Http\JsonResponse;

final readonly class AskMessageController
{
    public function __invoke(AskMessageRequest $request, CommandBus $commands): JsonResponse
    {
        $result = $commands->run($request->command());

        return new JsonResponse(['messageId' => $result]);
    }
}
