<?php

declare(strict_types=1);

namespace App\Http\Controllers\Links;

use App\Commands\LinkRecords\LinkRecordsCommand;
use App\Contracts\CommandBus;
use App\Contracts\RecordResolver;
use App\Http\Requests\Links\LinkRecordsRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class LinkRecordsController
{
    public function __invoke(
        LinkRecordsRequest $request,
        CommandBus $commands,
        RecordResolver $records,
        Redirector $redirect,
    ): RedirectResponse {
        $commands->run(new LinkRecordsCommand($request->source($records), $request->target($records)));

        return $redirect->back(303);
    }
}
