<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Runs\CaptureStatus;

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
     * @return list<CaptureStatus>
     */
    public function states(): array
    {
        return array_map(fn (PartCapture $part) => $part->status, $this->parts);
    }

    /**
     * @return array<string, string> part id => capture state
     */
    public function toArray(): array
    {
        $states = [];

        foreach ($this->parts as $part) {
            $states[$part->partId] = $part->status->value;
        }

        return $states;
    }
}
