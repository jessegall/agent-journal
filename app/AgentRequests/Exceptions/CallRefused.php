<?php

declare(strict_types=1);

namespace App\AgentRequests\Exceptions;

use App\AgentRequests\Support\CallKey;

/**
 * The journal refused the call with a code: the message is its safe text, and a keyed write can be sent again under
 * the same key.
 */
abstract class CallRefused extends CallFailed
{
    /**
     * @param  array<string, mixed>  $details
     */
    final public function __construct(
        public readonly string $refusalCode,
        string $message,
        public readonly string $callId,
        public readonly CallKey|null $key,
        public readonly array $details = [],
    ) {
        parent::__construct($message);
    }

    /**
     * @param  array<string, mixed>  $details
     */
    public static function answered(string $code, string $message, string $callId, CallKey|null $key, array $details): static
    {
        return new static($code, $message, $callId, $key, $details);
    }

    public function retryKey(): CallKey|null
    {
        return $this->key;
    }
}
