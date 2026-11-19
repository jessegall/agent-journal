<?php

declare(strict_types=1);

namespace App\Skills\Values;

use JsonSerializable;

/**
 * What a delivered skill publication wrote: its generation, publication, session and program, the selection it was
 * made from, and the digest of each file it wrote.
 */
final readonly class PublicationManifest implements JsonSerializable
{
    /**
     * @param  array<string, string>  $files  file digest by relative path
     */
    public function __construct(
        public string $generationId,
        public string $publicationId,
        public string $sessionId,
        public string $program,
        public string $selectionDigest,
        public array $files,
    ) {}

    /**
     * The manifest as the file a program finds beside the skills.
     */
    public function text(): string
    {
        return json_encode($this, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)."\n";
    }

    /**
     * @return array{
     *     generation: string,
     *     publication: string,
     *     session: string,
     *     program: string,
     *     selection_digest: string,
     *     files: array<string, string>,
     * }
     */
    public function jsonSerialize(): array
    {
        return [
            'generation' => $this->generationId,
            'publication' => $this->publicationId,
            'session' => $this->sessionId,
            'program' => $this->program,
            'selection_digest' => $this->selectionDigest,
            'files' => $this->files,
        ];
    }
}
