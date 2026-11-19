<?php

declare(strict_types=1);

namespace App\Communication\Data;

/**
 * One page of messages, oldest first, with the cursor of the next older page when there is one.
 */
final readonly class MessagePage
{
    public const int DEFAULT_LIMIT = 50;

    public const int LARGEST_LIMIT = 100;

    /**
     * @param  list<MessageView>  $messages
     */
    public function __construct(
        public array $messages,
        public string|null $olderCursor,
    ) {}
}
