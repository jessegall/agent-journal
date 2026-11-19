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
 * Reads the messages between two inboxes, both ways, older than the cursor.
 *
 * @implements JournalCall<MessagePage>
 */
#[Endpoint('communication/between', 'POST', MessagePage::class, CallEffect::Read)]
final class ListMessagesBetweenCall extends Data implements JournalCall
{
    public function __construct(
        #[Size(26)]
        public string $firstInboxId,
        #[Size(26)]
        public string $secondInboxId,
        public HistoryPage $page = new HistoryPage(),
    ) {}
}
