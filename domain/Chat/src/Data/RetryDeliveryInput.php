<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Retry on a message that was not delivered: the message under its request key, and the agent and session the sender
 * saw, so a stopped agent is started again for it.
 */
#[TypeScript]
final class RetryDeliveryInput extends Data
{
    public function __construct(
        #[Ulid]
        public readonly string $messageId,
        #[Ulid]
        public readonly string|null $agent = null,
        #[Ulid]
        public readonly string|null $expectedSessionId = null,
    ) {}
}
