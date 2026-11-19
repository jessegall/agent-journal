<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Communication\Calls\ShowMessageCall;
use App\Communication\Contracts\ConversationResolver;
use App\Communication\Data\MessageView;

/**
 * Reads one message.
 */
final readonly class ShowMessageController
{
    public function __invoke(ShowMessageCall $call, ConversationResolver $conversations): MessageView
    {
        return $conversations->detail($call->messageId);
    }
}
