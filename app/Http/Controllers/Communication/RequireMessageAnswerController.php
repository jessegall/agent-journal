<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Communication\RequireMessageAnswerRequest;
use Illuminate\Http\JsonResponse;

final readonly class RequireMessageAnswerController
{
    public function __invoke(RequireMessageAnswerRequest $request, CommandBus $commands): JsonResponse
    {
        $commands->run($request->command());

        return new JsonResponse(['messageId' => $request->command()->messageId]);
    }
}
