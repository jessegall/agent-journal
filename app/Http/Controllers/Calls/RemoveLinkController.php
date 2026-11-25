<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Records\LinkChanged;
use App\Calls\Records\RemoveLinkCall;
use App\Commands\Links\UnlinkRecords\UnlinkRecordsCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Records\RecordResolver;
use App\Support\RecordReference;

/**
 * Unlinks the two records the call names.
 */
final readonly class RemoveLinkController
{
    public function __invoke(RemoveLinkCall $call, CommandBus $commands, RecordResolver $records): LinkChanged
    {
        $source = $records->identify(RecordReference::parse($call->source));
        $target = $records->identify(RecordReference::parse($call->target));
        $commands->run(new UnlinkRecordsCommand($source, $target));

        return LinkChanged::from([
            'source' => $call->source,
            'target' => $call->target,
        ]);
    }
}
