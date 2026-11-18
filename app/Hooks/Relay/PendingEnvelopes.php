<?php

declare(strict_types=1);

namespace App\Hooks\Relay;

/**
 * The host's file of callback envelopes sent but not yet answered, one per file in a folder beside the bypass log:
 * kept before the first post and removed only after a valid reply.
 */
final readonly class PendingEnvelopes
{
    public function __construct(private string $folder) {}

    public function keep(CallbackEnvelope $envelope): void
    {
        if (! is_dir($this->folder)) {
            mkdir($this->folder, 0700, true);
        }

        file_put_contents($this->pathOf($envelope->id), $envelope->toJson(), LOCK_EX);
    }

    public function acknowledge(CallbackEnvelope $envelope): void
    {
        if (is_file($this->pathOf($envelope->id))) {
            unlink($this->pathOf($envelope->id));
        }
    }

    /**
     * @return list<CallbackEnvelope>
     */
    public function all(): array
    {
        $files = is_dir($this->folder) ? glob($this->folder.'/*.json') ?: [] : [];

        return array_map(fn (string $file): CallbackEnvelope => CallbackEnvelope::fromJson((string) file_get_contents($file)), $files);
    }

    private function pathOf(string $envelopeId): string
    {
        return "{$this->folder}/{$envelopeId}.json";
    }
}
