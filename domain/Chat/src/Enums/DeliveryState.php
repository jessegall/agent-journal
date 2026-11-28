<?php

declare(strict_types=1);

namespace Domain\Chat\Enums;

use App\Models\Messages\Message;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * How far one of the user's messages got to its agent: stored and queued, in the agent's session, taken in by the
 * agent, or given up on. It only moves forward, and a retry walks it again.
 */
#[TypeScript]
enum DeliveryState: string
{
    case Sent = 'sent';
    case Arrived = 'arrived';
    case Read = 'read';
    case Failed = 'failed';

    /**
     * The message's state: read once another member read or answered it, else as its delivery stands.
     */
    public static function of(Message $message, bool $isReadByOthers): self
    {
        return match (true) {
            $isReadByOthers => self::Read,
            $message->delivered_at !== null => self::Arrived,
            $message->delivery_failed_at !== null => self::Failed,
            default => self::Sent,
        };
    }
}
