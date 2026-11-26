<?php

declare(strict_types=1);

namespace App\Navigation\Contracts;

/**
 * Which records can be drafted by answering questions in a guided conversation, by the noun of the record.
 */
interface DraftProducers
{
    /**
     * Whether a producer is registered for the noun, so its creation offers the guided entry.
     */
    public function offersGuided(string $noun): bool;
}
