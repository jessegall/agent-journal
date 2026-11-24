<?php

declare(strict_types=1);

namespace App\Calls\Communication;

use App\Attributes\Endpoint;
use App\Contracts\Domains\JournalCall;
use App\Data\Messages\MessagePage;
use App\Enums\CallEffect;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Reads the messages between two inboxes, both ways, older than the cursor.
 *
 * @implements JournalCall<MessagePage>
 */
#[MapName(SnakeCaseMapper::class)]
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
