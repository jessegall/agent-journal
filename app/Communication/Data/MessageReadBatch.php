<?php

declare(strict_types=1);

namespace App\Communication\Data;

/**
 * What reading a batch of one inbox's messages did, message by message.
 */
final readonly class MessageReadBatch
{
    /**
     * @param  list<MessageReadResult>  $results
     */
    public function __construct(public array $results) {}
}
