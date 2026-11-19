<?php

declare(strict_types=1);

namespace App\Communication\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\Communication\Data\InboxCounts;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Counts an inbox's unread, unclaimed and claimed messages.
 *
 * @implements JournalCall<InboxCounts>
 */
#[Endpoint('communication/counts', 'POST', InboxCounts::class, CallEffect::Read)]
#[MapName(SnakeCaseMapper::class)]
final class CountInboxMessagesCall extends Data implements JournalCall
{
    public function __construct(
        #[Size(26)]
        public string $inboxId,
    ) {}
}
