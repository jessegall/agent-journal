<?php

declare(strict_types=1);

namespace App\Sharing\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Http\Data\Sharing\ShareProposalStatusData;
use App\Numbers\Support\RecordReference;
use App\Records\Contracts\RecordResolver;
use App\Sharing\Calls\RequestShareCall;
use App\Sharing\Commands\RequestShare\RequestShareCommand;

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
