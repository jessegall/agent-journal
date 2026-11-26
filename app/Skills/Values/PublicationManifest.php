<?php

declare(strict_types=1);

namespace App\Skills\Values;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * What a delivered skill publication wrote: its generation, publication, session and driver, the selection it was
 * made from, and the digest of each file it wrote.
 */
final class PublicationManifest extends Data
{
    /**
     * @param  array<string, string>  $files  file digest by relative path
     */
    public function __construct(
        #[MapName('generation')]
        public readonly string $generationId,
        #[MapName('publication')]
        public readonly string $publicationId,
        #[MapName('session')]
        public readonly string $sessionId,
        public readonly string $driver,
        #[MapName('selection_digest')]
        public readonly string $selectionDigest,
        public readonly array $files,
    ) {}

    /**
     * The manifest as the file a driver finds beside the skills.
     */
    public function text(): string
    {
        return json_encode($this->toArray(), JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)."\n";
    }
}
