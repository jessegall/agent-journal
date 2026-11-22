<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Calls;

use Domain\Chat\Calls\DockListCall;
use Domain\Chat\Data\DockListData;
use Domain\Chat\Resolvers\Support\DockListing;
use Domain\Chat\Support\DockRequests;

/**
 * Lists a conversation's placements for a journal caller, with only their safe facts.
 */
final readonly class DockListController
{
    public function __invoke(DockListCall $call, DockRequests $requests, DockListing $listing): DockListData
    {
        $conversation = $requests->chosenConversation($call->chat);

        return $listing->of($conversation, $call->limit);
    }
}
