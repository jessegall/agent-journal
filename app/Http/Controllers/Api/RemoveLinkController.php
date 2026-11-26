<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Records\LinkChanged;
use App\Api\Records\RemoveLinkPayload;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Links\Commands\UnlinkRecords\UnlinkRecordsCommand;
use App\Records\Contracts\RecordResolver;
use App\Support\RecordReference;

/**
 * Unlinks the two records the call names.
 */
final readonly class RemoveLinkController
{
    #[Dispatches(UnlinkRecordsCommand::class)]
    public function __invoke(RemoveLinkPayload $call, CommandBus $commands, RecordResolver $records): LinkChanged
    {
        $source = $records->identify(RecordReference::parse($call->source));
        $target = $records->identify(RecordReference::parse($call->target));
        $commands->run(new UnlinkRecordsCommand($source, $target));

        return LinkChanged::from(['source' => $call->source, 'target' => $call->target]);
    }
}
