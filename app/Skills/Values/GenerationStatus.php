<?php

declare(strict_types=1);

namespace App\Skills\Values;

use App\Skills\Enums\GenerationState;

/**
 * Where the newest generation of the catalogue stands: ready, failed with its reason, or retired.
 */
final readonly class GenerationStatus
{
    public function __construct(
        public string $generationId,
        public GenerationState $state,
        public string $catalogueDigest,
        public string|null $error,
    ) {}

    /**
     * @return array{generation: string, state: string, digest: string, error: string|null}
     */
    public function toArray(): array
    {
        return [
            'generation' => $this->generationId,
            'state' => $this->state->value,
            'digest' => $this->catalogueDigest,
            'error' => $this->error,
        ];
    }
}
