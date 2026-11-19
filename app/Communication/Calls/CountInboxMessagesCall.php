<?php

declare(strict_types=1);

namespace App\Communication\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\Communication\Data\InboxCounts;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Data;

/**
 * Counts an inbox's unread, unclaimed and claimed messages.
 *
 * @implements JournalCall<InboxCounts>
 */
#[Endpoint('communication/counts', 'POST', InboxCounts::class, CallEffect::Read)]
final class CountInboxMessagesCall extends Data implements JournalCall
{
    public function __construct(
        #[Size(26)]
        public string $inboxId,
    ) {}
}
