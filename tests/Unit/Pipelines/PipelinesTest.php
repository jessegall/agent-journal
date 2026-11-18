<?php

declare(strict_types=1);

namespace Tests\Unit\Pipelines;

use App\Pipelines\Exceptions\StepOutOfOrder;
use App\Pipelines\Support\Pipelines;
use Illuminate\Container\Container;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Pipelines\Counted;
use Tests\Fixtures\Pipelines\CountingPipeline;
use Tests\Fixtures\Pipelines\CountWords;
use Tests\Fixtures\Pipelines\Words;

/**
 * A pipeline hands each pipe's stage to the next, is resolved once, and names a step that stands out of order.
 */
final class PipelinesTest extends TestCase
{
    public function test_each_pipe_turns_its_stage_into_the_next_and_the_pipeline_is_resolved_once(): void
    {
        CountWords::$built = 0;
        $pipelines = new Pipelines(new Container());

        $first = $pipelines->run(CountingPipeline::class, new Words('three small words'), Counted::class);
        $second = $pipelines->run(CountingPipeline::class, new Words('two words'), Counted::class);

        $this->assertSame([3, 2], [$first->count, $second->count]);
        $this->assertSame(1, CountWords::$built);
    }

    public function test_a_pipe_handed_a_stage_it_does_not_take_is_named(): void
    {
        $container = new Container();
        $container->bind(CountingPipeline::class, fn () => new CountingPipeline(times: 2));

        $this->expectException(StepOutOfOrder::class);
        $this->expectExceptionMessage('['.CountWords::class.'] was handed a ['.Counted::class.']');

        new Pipelines($container)->run(CountingPipeline::class, new Words('a b'), Counted::class);
    }

    public function test_a_run_that_ends_on_another_stage_is_named(): void
    {
        $this->expectException(StepOutOfOrder::class);
        $this->expectExceptionMessage('ended on a ['.Counted::class.'] where a ['.Words::class.'] is read');

        new Pipelines(new Container())->run(CountingPipeline::class, new Words('a b'), Words::class);
    }
}
