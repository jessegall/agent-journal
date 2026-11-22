<?php

declare(strict_types=1);

namespace App\Http\Controllers\Links;

use App\Commands\UnlinkRecords\UnlinkRecordsCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Records\RecordResolver;
use App\Http\Requests\Links\LinkRecordsRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class UnlinkRecordsController
{
    public function __invoke(
        LinkRecordsRequest $request,
        CommandBus $commands,
        RecordResolver $records,
        Redirector $redirect,
    ): RedirectResponse {
        $commands->run(new UnlinkRecordsCommand($request->source($records), $request->target($records)));

        return $redirect->back(303);
    }
}
