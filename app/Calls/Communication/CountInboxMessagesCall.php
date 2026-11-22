<?php

declare(strict_types=1);

namespace App\Calls\Communication;

use App\Attributes\Endpoint;
use App\Contracts\Domains\JournalCall;
use App\Data\InboxCounts;
use App\Enums\CallEffect;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Counts an inbox's unread, unclaimed and claimed messages.
 *
 * @implements JournalCall<InboxCounts>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('communication/counts', 'POST', InboxCounts::class, CallEffect::Read)]
final class CountInboxMessagesCall extends Data implements JournalCall
{
    public function __construct(
        #[Size(26)]
        public string $inboxId,
    ) {}
}
