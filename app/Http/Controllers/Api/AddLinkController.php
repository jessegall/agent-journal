<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Links\Commands\LinkRecords\LinkRecordsCommand;
use App\Records\Api\AddLinkPayload;
use App\Records\Api\LinkChanged;
use App\Records\Contracts\RecordResolver;
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

        return LinkChanged::from(['source' => $call->source, 'target' => $call->target]);
    }
}
