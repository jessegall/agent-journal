<?php

declare(strict_types=1);

namespace Domain\Sharing\Http\Controllers\Api;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Records\RecordResolver;
use App\Support\RecordReference;
use Domain\Sharing\Api\RequestSharePayload;
use Domain\Sharing\Commands\RequestShare\RequestShareCommand;
use Domain\Sharing\Data\ShareProposalStatusData;

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
