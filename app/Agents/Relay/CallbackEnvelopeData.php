<?php

declare(strict_types=1);

namespace App\Agents\Relay;

use Spatie\LaravelData\Data;

/**
 * A callback envelope as the host keeps it while it waits for an answer, the shape CallbackEnvelope::toJson writes.
 */
final class CallbackEnvelopeData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $driver,
        public readonly string $body,
        public readonly string $bodyDigest,
        public readonly int $issuedAt,
        public readonly int $deadlineAt,
    ) {}

    public function envelope(): CallbackEnvelope
    {
        return new CallbackEnvelope(
            $this->id,
            $this->driver,
            $this->body,
            $this->bodyDigest,
            $this->issuedAt,
            $this->deadlineAt,
        );
    }
}
