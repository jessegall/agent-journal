<?php

declare(strict_types=1);

namespace App\Communication\Calls;

use App\Communication\Data\MessagePage;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Data;

/**
 * Which page of a message history to read: the messages older than the cursor, up to the limit.
 */
final class HistoryPage extends Data
{
    public function __construct(
        #[Size(26)]
        public readonly string|null $olderCursor = null,
        #[Min(1), Max(100)]
        public readonly int $limit = MessagePage::DEFAULT_LIMIT,
    ) {}
}
