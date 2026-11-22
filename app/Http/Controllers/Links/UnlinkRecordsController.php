<?php

declare(strict_types=1);

namespace App\Http\Controllers\Links;

use App\Commands\UnlinkRecords\UnlinkRecordsCommand;
use App\Contracts\CommandBus;
use App\Contracts\RecordResolver;
use App\Http\Requests\Links\LinkRecordsRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class UnlinkRecordsController
{
    public function __invoke(
        LinkRecordsRequest $request,
        CommandBus $commands,
        RecordResolver $records,
        Redirector $redirect,
    ): JsonResponse|RedirectResponse {
        $commands->run(new UnlinkRecordsCommand($request->source($records), $request->target($records)));

        if (! $request->expectsJson()) {
            return $redirect->back(303);
        }

        return new JsonResponse(['source' => $request->sourceReference(), 'target' => $request->targetReference()]);
    }
}
