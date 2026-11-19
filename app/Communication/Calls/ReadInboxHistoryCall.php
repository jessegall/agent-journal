<?php

declare(strict_types=1);

namespace App\Communication\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\Communication\Data\MessagePage;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Data;

/**
 * Reads an inbox's whole history, incoming and outgoing, older than the cursor.
 *
 * @implements JournalCall<MessagePage>
 */
#[Endpoint('communication/history', 'POST', MessagePage::class, CallEffect::Read)]
final class ReadInboxHistoryCall extends Data implements JournalCall
{
    public function __construct(
        #[Size(26)]
        public string $inboxId,
        public HistoryPage $page = new HistoryPage(),
    ) {}
}
