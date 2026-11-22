<?php

declare(strict_types=1);

namespace App\Communication\Events;

use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * One member was shown one chat message for the first time.
 */
final readonly class ChatReceiptPresented implements Event, ShouldDispatchAfterCommit, UserInterfaceUpdater
{
    public function __construct(
        public string $receiptId,
        public string $messageId,
        public string $intervalId,
    ) {}
}
