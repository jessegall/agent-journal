<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Skills\PublicationStatus;
use JsonSerializable;

/**
 * Where one session's newest skill publication stands, with its safe error, and the command that retries it when it
 * failed.
 */
final readonly class PublicationReport implements JsonSerializable
{
    public function __construct(
        public string $publicationId,
        public string $sessionId,
        public PublicationStatus $status,
        public string $generationId,
        public string $selectionDigest,
        public string $target,
        public string|null $error,
    ) {}

    /**
     * Whether an operator can retry it once its cause is fixed: only a failed publication.
     */
    public function isRetryable(): bool
    {
        return $this->status === PublicationStatus::Failed;
    }

    public function retryCommand(): string
    {
        return "php artisan skill:retry {$this->publicationId}";
    }

    /**
     * @return array<string, string|null>
     */
    public function jsonSerialize(): array
    {
        return [
            'session' => $this->sessionId,
            'publication' => $this->publicationId,
            'state' => $this->status->value,
            'generation' => $this->generationId,
            'selection_digest' => $this->selectionDigest,
            'target' => $this->target,
            'error' => $this->error,
            'retry' => $this->isRetryable() ? $this->retryCommand() : null,
        ];
    }
}
