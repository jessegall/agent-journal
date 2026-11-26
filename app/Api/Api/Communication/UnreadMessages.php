<?php

declare(strict_types=1);

namespace App\Api\Api\Communication;

use App\Messages\Data\MessageView;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * The unread messages a read returned, oldest first; each is now read.
 */
final class UnreadMessages extends Data
{
    /**
     * @param  list<MessageView>  $messages
     */
    public function __construct(
        #[DataCollectionOf(MessageView::class)]
        public array $messages,
    ) {}
}
