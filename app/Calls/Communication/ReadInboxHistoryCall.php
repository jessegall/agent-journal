<?php

declare(strict_types=1);

namespace App\Calls\Communication;

use App\Attributes\Endpoint;
use App\Contracts\JournalCall;
use App\Data\MessagePage;
use App\Enums\CallEffect;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Reads an inbox's whole history, incoming and outgoing, older than the cursor.
 *
 * @implements JournalCall<MessagePage>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('communication/history', 'POST', MessagePage::class, CallEffect::Read)]
final class ReadInboxHistoryCall extends Data implements JournalCall
{
    public function __construct(
        #[Size(26)]
        public string $inboxId,
        public HistoryPage $page = new HistoryPage(),
    ) {}
}
