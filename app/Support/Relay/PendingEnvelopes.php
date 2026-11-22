<?php

declare(strict_types=1);

namespace App\Support\Relay;

use App\Contracts\Files\Files;
use App\Enums\Permissions;
use App\Values\FilePath;

/**
 * The host's file of callback envelopes sent but not yet answered, one per file in a folder beside the bypass log:
 * kept before the first post and removed only after a valid reply.
 */
final readonly class PendingEnvelopes
{
    public function __construct(
        private Files $files,
        private FilePath $folder,
    ) {}

    public function keep(CallbackEnvelope $envelope): void
    {
        $this->files->makeFolder($this->folder, Permissions::OwnerOnly);
        $this->files->write($this->pathOf($envelope->id), $envelope->toJson());
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
        if (! $this->files->isFolder($this->folder)) {
            return [];
        }

        return array_map(
            fn (FilePath $path) => CallbackEnvelope::fromJson($this->files->read($path)),
            $this->files->list($this->folder, pattern: '*.json')->paths(),
        );
    }

    private function pathOf(string $envelopeId): FilePath
    {
        return $this->folder->child("{$envelopeId}.json");
    }
}
