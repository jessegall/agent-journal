<?php

declare(strict_types=1);

namespace App\Calls\Communication;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * The messages a read or take touched.
 */
final class MessagesRead extends Data
{
    /**
     * @param  list<MessageRead>  $messageReads
     */
    public function __construct(
        #[MapName('results')]
        #[DataCollectionOf(MessageRead::class)]
        public array $messageReads,
    ) {}
}
