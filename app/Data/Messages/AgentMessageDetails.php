<?php

declare(strict_types=1);

namespace App\Data\Messages;

use App\Mcp\Support\TextChunk;

/**
 * One message summary or a bounded body, with a cursor for an omitted body or ancestor.
 */
final readonly class AgentMessageDetails
{
    public function __construct(
        public AgentMessageCard $message,
        public TextChunk|null $body = null,
        public string|null $continuation = null,
    ) {}
}
