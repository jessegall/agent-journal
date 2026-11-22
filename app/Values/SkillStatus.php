<?php

declare(strict_types=1);

namespace App\Values;

use JsonSerializable;

/**
 * The skill delivery as the actor may see it: the newest generation, absent before the first refresh, and the newest
 * publication of each visible session.
 */
final readonly class SkillStatus implements JsonSerializable
{
    /**
     * @param  list<PublicationStatus>  $publications
     */
    public function __construct(
        public GenerationStatus|null $generation,
        public array $publications,
    ) {}

    /**
     * @return array{generation: array<string, string|null>|null, publications: list<array<string, string|null>>}
     */
    public function jsonSerialize(): array
    {
        return [
            'generation' => $this->generation?->jsonSerialize(),
            'publications' => array_map(
                fn (PublicationStatus $publication) => $publication->jsonSerialize(),
                $this->publications,
            ),
        ];
    }
}
