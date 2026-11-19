<?php

declare(strict_types=1);

namespace App\AgentRequests\Enums;

/**
 * What a call does to the journal, and so who may send it again: a read changes nothing, a keyed write changes state
 * once per request key, and a sequenced write is safe to repeat by its own sequence or offset keys.
 */
enum CallEffect: string
{
    case Read = 'read';
    case KeyedWrite = 'keyed_write';
    case SequencedWrite = 'sequenced_write';

    /**
     * Whether the client sends the call again after a failure that may pass; a sequenced write is sent again by its
     * caller on its next turn instead.
     */
    public function isRetriedByClient(): bool
    {
        return $this !== self::SequencedWrite;
    }

    /**
     * Whether the call carries a request key and names who keeps its receipt.
     */
    public function needsReceipt(): bool
    {
        return $this === self::KeyedWrite;
    }
}
