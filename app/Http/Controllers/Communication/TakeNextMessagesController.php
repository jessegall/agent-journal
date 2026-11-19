<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Communication\TakeNextMessagesRequest;
use Illuminate\Http\JsonResponse;

final readonly class TakeNextMessagesController
{
    public function __invoke(TakeNextMessagesRequest $request, CommandBus $commands): JsonResponse
    {
        $result = $commands->run($request->command());

        return new JsonResponse($result);
    }
}
