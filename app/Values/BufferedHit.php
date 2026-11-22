<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\ScoreTier;

/**
 * A certified hit a source returned that the search has not shown yet: its identity and tier only, never its
 * text, so it is reread and rechecked before it is shown.
 */
final readonly class BufferedHit
{
    public function __construct(
        public HitIdentity $identity,
        public ScoreTier $score,
    ) {}

    /**
     * Below zero when this hit comes first: the higher tier, then the identity ascending.
     */
    public function compare(self $other): int
    {
        return $this->score->compare($other->score) ?: $this->identity->compare($other->identity);
    }

    /**
     * @return array{source: string, type: string, id: string, location: string|null, score: int}
     */
    public function toArray(): array
    {
        return [
            'source' => $this->identity->sourceKey,
            'type' => $this->identity->recordType,
            'id' => $this->identity->recordId,
            'location' => $this->identity->locationId,
            'score' => $this->score->value,
        ];
    }

    /**
     * @param  array{source: string, type: string, id: string, location: string|null, score: int}  $fields
     */
    public static function fromArray(array $fields): self
    {
        return new self(
            new HitIdentity($fields['source'], $fields['type'], $fields['id'], $fields['location']),
            ScoreTier::from($fields['score']),
        );
    }
}
