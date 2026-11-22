<?php

declare(strict_types=1);

namespace App\Data;

/**
 * What reading a batch of one inbox's messages did, message by message.
 */
final readonly class MessageReadBatch
{
    /**
     * @param  list<MessageReadResult>  $messageReads
     */
    public function __construct(public array $messageReads) {}
}
