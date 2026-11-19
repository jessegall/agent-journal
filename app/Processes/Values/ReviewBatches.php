<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\ReviewLimit;

/**
 * Shapes split for classification by agents: batches within the count and character caps, and the shapes too long to
 * send at all.
 */
final readonly class ReviewBatches
{
    /**
     * @param  list<list<CommandShape>>  $batches
     * @param  list<CommandShape>  $tooLong
     */
    private function __construct(public array $batches, public array $tooLong) {}

    /**
     * @param  list<CommandShape>  $shapes
     */
    public static function of(array $shapes): self
    {
        $batches = [];
        $batch = [];
        $characters = 0;
        foreach ($shapes as $shape) {
            if ($shape->isTooLongForReview()) {
                continue;
            }
            if ($batch !== [] && (count($batch) === ReviewLimit::BatchShapes->value || ReviewLimit::BatchCharacters->isPassedBy($characters + $shape->length()))) {
                $batches[] = $batch;
                $batch = [];
                $characters = 0;
            }
            $batch[] = $shape;
            $characters += $shape->length();
        }

        return new self(
            $batch === [] ? $batches : [...$batches, $batch],
            array_values(array_filter($shapes, fn (CommandShape $shape): bool => $shape->isTooLongForReview())),
        );
    }
}
