<?php

declare(strict_types=1);

namespace App\Hooks\Relay;

use Illuminate\Filesystem\Filesystem;

/**
 * The host's file of callback envelopes sent but not yet answered, one per file in a folder beside the bypass log:
 * kept before the first post and removed only after a valid reply.
 */
final readonly class PendingEnvelopes
{
    public function __construct(
        private Filesystem $files,
        private string $folder,
    ) {}

    public function keep(CallbackEnvelope $envelope): void
    {
        $this->files->ensureDirectoryExists($this->folder, 0700);
        $this->files->put($this->pathOf($envelope->id), $envelope->toJson(), lock: true);
    }

    public function acknowledge(CallbackEnvelope $envelope): void
    {
        $this->files->delete($this->pathOf($envelope->id));
    }

    /**
     * @return list<CallbackEnvelope>
     */
    public function all(): array
    {
        $paths = $this->files->glob($this->folder.'/*.json');

        return array_values(array_map(fn (string $path) => CallbackEnvelope::fromJson($this->files->get($path)), $paths));
    }

    private function pathOf(string $envelopeId): string
    {
        return "{$this->folder}/{$envelopeId}.json";
    }
}
