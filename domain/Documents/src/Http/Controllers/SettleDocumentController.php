<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Documents\Commands\SettleDocument;
use Domain\Documents\Http\Requests\SettleRecordRequest;
use Illuminate\Http\JsonResponse;

final readonly class SettleDocumentController
{
    public function __invoke(SettleRecordRequest $request, CommandBus $commands): JsonResponse
    {
        $commands->run(new SettleDocument($request->number(), $request->revision(), $request->reason()));

        return new JsonResponse(['settled' => true]);
    }
}
