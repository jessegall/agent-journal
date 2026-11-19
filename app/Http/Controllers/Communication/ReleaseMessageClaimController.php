<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Communication\ReleaseMessageClaimRequest;
use Illuminate\Http\JsonResponse;

final readonly class ReleaseMessageClaimController
{
    public function __invoke(ReleaseMessageClaimRequest $request, CommandBus $commands): JsonResponse
    {
        $commands->run($request->command());

        return new JsonResponse(['messageId' => $request->command()->messageId]);
    }
}
