<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Communication\Calls\ReadWakeStatusCall;
use App\Communication\Calls\WakeStatuses;
use App\Communication\Contracts\ConversationResolver;
use App\Communication\Data\WakeStatus;

/**
 * Answers whether each notified member's runtime accepted the message's wake.
 */
final readonly class ReadWakeStatusController
{
    public function __invoke(ReadWakeStatusCall $call, ConversationResolver $conversations): WakeStatuses
    {
        $members = array_map(
            fn (WakeStatus $status) => [
                'actorType' => $status->actorType,
                'actorId' => $status->actorId,
                'requestId' => $status->requestId,
            ],
            $conversations->wakeStatus($call->messageId),
        );

        return WakeStatuses::from(['members' => $members]);
    }
}
