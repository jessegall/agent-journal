<?php

declare(strict_types=1);

namespace Tests\Unit\Processes;

use App\Enums\ReviewLimit;
use App\Values\CommandShape;
use App\Values\ReviewBatches;
use PHPUnit\Framework\TestCase;

/**
 * Only short shapes reach an agent, in batches capped in count and characters.
 */
final class ReviewBatchesTest extends TestCase
{
    public function test_an_over_long_shape_is_never_in_a_batch_and_its_refusal_names_the_limit(): void
    {
        $long = $this->shape('long', ReviewLimit::ShapeCharacters->value + 1);

        $batches = ReviewBatches::of([$this->shape('short', 40), $long]);

        $this->assertSame([$long], $batches->tooLong);
        $this->assertNotContains($long, array_merge(...$batches->batches));
        $this->assertStringContainsString(ReviewLimit::ShapeCharacters->label(), $long->refusal());
    }

    public function test_no_batch_exceeds_its_count_or_character_cap(): void
    {
        $shapes = array_map(fn (int $index) => $this->shape("shape-{$index}", 900), range(1, 50));

        $batches = ReviewBatches::of($shapes);

        $this->assertCount(50, array_merge(...$batches->batches));

        foreach ($batches->batches as $batch) {
            $this->assertLessThanOrEqual(ReviewLimit::BatchShapes->value, count($batch));
            $this->assertLessThanOrEqual(
                ReviewLimit::BatchCharacters->value,
                array_sum(array_map(fn (CommandShape $shape): int => $shape->length(), $batch)),
            );
        }
    }

    private function shape(string $id, int $length): CommandShape
    {
        return new CommandShape($id, 'tool', 'run', str_repeat('a', $length));
    }
}
