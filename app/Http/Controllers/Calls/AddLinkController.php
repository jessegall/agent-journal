<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Records\AddLinkCall;
use App\Calls\Records\LinkChanged;
use App\Commands\Links\LinkRecords\LinkRecordsCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Records\RecordResolver;
use App\Support\RecordReference;

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
