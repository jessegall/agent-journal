<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Skills\GenerationStatus;
use JsonSerializable;

/**
 * Where the newest generation of the catalogue stands: ready, failed with its reason, or retired.
 */
final readonly class GenerationReport implements JsonSerializable
{
    public function __construct(
        public string $generationId,
        public GenerationStatus $status,
        public string $catalogueDigest,
        public string|null $error,
    ) {}

    /**
     * @return array{generation: string, state: string, digest: string, error: string|null}
     */
    public function jsonSerialize(): array
    {
        return [
            'generation' => $this->generationId,
            'state' => $this->status->value,
            'digest' => $this->catalogueDigest,
            'error' => $this->error,
        ];
    }
}
