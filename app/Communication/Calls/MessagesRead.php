<?php

declare(strict_types=1);

namespace App\Communication\Calls;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * The messages a read or take touched.
 */
final class MessagesRead extends Data
{
    /**
     * @param  list<MessageRead>  $results
     */
    public function __construct(
        #[DataCollectionOf(MessageRead::class)]
        public array $results,
    ) {}
}
