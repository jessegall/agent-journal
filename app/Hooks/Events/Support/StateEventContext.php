<?php

declare(strict_types=1);

namespace App\Hooks\Events\Support;

/**
 * Ordered contributions to a target's next hook and their attention messages.
 */
final readonly class StateEventContext
{
    /**
     * @param list<string> $lines
     * @param list<string> $messages
     */
    public function __construct(public array $lines, public array $messages) {}

    public function isEmpty(): bool
    {
        return $this->lines === [];
    }

    public function requestsAttention(): bool
    {
        return $this->messages !== [];
    }
}
