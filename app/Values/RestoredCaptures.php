<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Runs\CaptureState;

/**
 * What checking a run's restored output answers: the capture state of each of its parts.
 */
final readonly class RestoredCaptures
{
    /**
     * @param  list<PartCapture>  $parts
     */
    public function __construct(public array $parts) {}

    /**
     * @return list<CaptureState>
     */
    public function states(): array
    {
        return array_map(fn (PartCapture $part): CaptureState => $part->state, $this->parts);
    }

    /**
     * @return array<string, string> part id => capture state
     */
    public function toArray(): array
    {
        $states = [];

        foreach ($this->parts as $part) {
            $states[$part->partId] = $part->state->value;
        }

        return $states;
    }
}
