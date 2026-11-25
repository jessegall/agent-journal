<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Records\AddLinkPayload;
use App\Api\Records\LinkChanged;
use App\Attributes\Bus\Dispatches;
use App\Commands\Links\LinkRecords\LinkRecordsCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Records\RecordResolver;
use App\Support\RecordReference;

/**
 * Links the two records the call names.
 */
final readonly class AddLinkController
{
    #[Dispatches(LinkRecordsCommand::class)]
    public function __invoke(AddLinkPayload $call, CommandBus $commands, RecordResolver $records): LinkChanged
    {
        $source = $records->identify(RecordReference::parse($call->source));
        $target = $records->identify(RecordReference::parse($call->target));
        $commands->run(new LinkRecordsCommand($source, $target));

        return LinkChanged::from([
            'source' => $call->source,
            'target' => $call->target,
        ]);
    }
}
