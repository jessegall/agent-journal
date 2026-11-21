<?php

declare(strict_types=1);

namespace Domain\Helpers\Values;

/**
 * What a steer did: added to the live job, or kept as a message with the command that would carry it.
 */
final readonly class SteerReceipt
{
    private function __construct(
        public string|null $jobId,
        public string|null $messageId,
        public string|null $suggestedCommand,
    ) {}

    public static function steered(string $jobId): self
    {
        return new self($jobId, null, null);
    }

    public static function kept(string $messageId, string $suggestedCommand): self
    {
        return new self(null, $messageId, $suggestedCommand);
    }
}
