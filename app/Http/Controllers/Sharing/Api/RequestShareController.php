<?php

declare(strict_types=1);

namespace App\Http\Controllers\Sharing\Api;

use App\Api\Sharing\RequestSharePayload;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Records\Contracts\RecordResolver;
use App\Sharing\Commands\RequestShare\RequestShareCommand;
use App\Sharing\Data\ShareProposalStatusData;
use App\Support\RecordReference;

/**
 * Proposes sharing the named record and answers the proposal.
 */
final readonly class RequestShareController
{
    #[Dispatches(RequestShareCommand::class)]
    public function __invoke(
        RequestSharePayload $call,
        RecordResolver $records,
        CommandBus $commands,
    ): ShareProposalStatusData {
        $reference = RecordReference::of($call->alias, RecordReference::number($call->number));
        $root = $records->identify($reference);
        $status = $commands->run(new RequestShareCommand($root->type, $root->id, $call->requestKey->value));

        return ShareProposalStatusData::fromStatus($status);
    }
}
