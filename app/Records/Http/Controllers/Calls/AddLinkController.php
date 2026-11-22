<?php

declare(strict_types=1);

namespace App\Records\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Numbers\Support\RecordReference;
use App\Records\Calls\AddLinkCall;
use App\Records\Calls\LinkChanged;
use App\Records\Commands\LinkRecords\LinkRecordsCommand;
use App\Records\Contracts\RecordResolver;

/**
 * Links the two records the call names.
 */
final readonly class AddLinkController
{
    public function __invoke(AddLinkCall $call, CommandBus $commands, RecordResolver $records): LinkChanged
    {
        $source = $records->identify(RecordReference::parse($call->source));
        $target = $records->identify(RecordReference::parse($call->target));
        $commands->run(new LinkRecordsCommand($source, $target));

        return LinkChanged::from(['source' => $call->source, 'target' => $call->target]);
    }
}
