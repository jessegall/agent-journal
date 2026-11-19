<?php

declare(strict_types=1);

namespace App\Records\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Numbers\Support\RecordReference;
use App\Records\Calls\LinkChanged;
use App\Records\Calls\RemoveLinkCall;
use App\Records\Commands\UnlinkRecords;
use App\Records\Contracts\RecordResolver;

/**
 * Unlinks the two records the call names.
 */
final readonly class RemoveLinkController
{
    public function __invoke(RemoveLinkCall $call, CommandBus $commands, RecordResolver $records): LinkChanged
    {
        $source = $records->identify(RecordReference::parse($call->source));
        $target = $records->identify(RecordReference::parse($call->target));
        $commands->run(new UnlinkRecords($source, $target));

        return LinkChanged::from(['source' => $call->source, 'target' => $call->target]);
    }
}
