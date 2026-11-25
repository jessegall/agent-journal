<?php

declare(strict_types=1);

namespace App\Http\Controllers\Links;

use App\Attributes\Bus\Dispatches;
use App\Commands\Links\LinkRecords\LinkRecordsCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Records\RecordResolver;
use App\Http\Requests\Links\LinkRecordsRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class LinkRecordsController
{
    #[Dispatches(LinkRecordsCommand::class)]
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
