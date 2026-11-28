<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Api;

use Domain\Chat\Api\DockListPayload;
use Domain\Chat\Data\DockListData;
use Domain\Chat\Support\DockPageReader;
use Domain\Chat\Support\DockRequests;

/**
 * Lists a conversation's placements for a journal caller, with only their safe facts.
 */
final readonly class DockListController
{
    public function __invoke(DockListPayload $call, DockRequests $requests, DockPageReader $listing): DockListData
    {
        $inbox = $requests->chosenInbox($call->chat);

        return $listing->of($inbox, $call->limit);
    }
}
