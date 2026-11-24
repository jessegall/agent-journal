<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Sharing\RequestShareCall;
use App\Commands\Sharing\RequestShare\RequestShareCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Records\RecordResolver;
use App\Data\Sharing\ShareProposalStatusData;
use App\Support\RecordReference;

/**
 * Proposes sharing the named record and answers the proposal.
 */
final readonly class RequestShareController
{
    public function __invoke(
        RequestShareCall $call,
        RecordResolver $records,
        CommandBus $commands,
    ): ShareProposalStatusData {
        $reference = RecordReference::of($call->alias, RecordReference::number($call->number));
        $root = $records->identify($reference);
        $status = $commands->run(new RequestShareCommand($root->type, $root->id, $call->requestKey->value));

        return ShareProposalStatusData::fromStatus($status);
    }
}
