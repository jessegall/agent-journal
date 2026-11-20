<?php

declare(strict_types=1);

namespace Tests\Unit\Pipelines;

use App\Pipelines\Exceptions\StepOutOfOrder;
use App\Pipelines\Support\Pipelines;
use Illuminate\Container\Container;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Pipelines\Counted;
use Tests\Fixtures\Pipelines\CountLastWordPipeline;
use Tests\Fixtures\Pipelines\CountWords;
use Tests\Fixtures\Pipelines\CountWordsPipeline;
use Tests\Fixtures\Pipelines\Words;

/**
 * A pipeline hands each step's stage to the next, nests pipelines, repeats rounds and chooses steps, is resolved once,
 * runs steps listed inline, and names a step that stands out of order.
 */
final class PipelinesTest extends TestCase
{
    public function test_each_pipe_turns_its_stage_into_the_next_and_the_pipeline_is_resolved_once(): void
    {
        CountWords::$built = 0;
        $pipelines = new Pipelines(new Container());

        $first = $pipelines->run(CountWordsPipeline::class, new Words('three small words'), Counted::class);
        $second = $pipelines->run(CountWordsPipeline::class, new Words('two words'), Counted::class);

        $this->assertSame([3, 2], [$first->count, $second->count]);
        $this->assertSame(1, CountWords::$built);
    }

    public function test_steps_listed_inline_run_in_order_with_no_definition_class(): void
    {
        $pipelines = new Pipelines(new Container());

        $counted = $pipelines->runSteps([CountWords::class], new Words('three small words'), Counted::class);

        $this->assertSame(3, $counted->count);
        $this->expectException(StepOutOfOrder::class);
        $pipelines->runSteps([CountWords::class], new Words('a b'), Words::class);
    }

    public function test_a_pipe_handed_a_stage_it_does_not_take_is_named(): void
    {
        $container = new Container();
        $container->bind(CountWordsPipeline::class, fn () => new CountWordsPipeline(times: 2));

        $this->expectException(StepOutOfOrder::class);
        $this->expectExceptionMessage('['.CountWords::class.'] was handed a ['.Counted::class.']');

        new Pipelines($container)->run(CountWordsPipeline::class, new Words('a b'), Counted::class);
    }

    public function test_a_run_that_ends_on_another_stage_is_named(): void
    {
        $this->expectException(StepOutOfOrder::class);
        $this->expectExceptionMessage('ended on a ['.Counted::class.'] where a ['.Words::class.'] is read');

        new Pipelines(new Container())->run(CountWordsPipeline::class, new Words('a b'), Words::class);
    }

    public function test_a_nested_pipeline_a_repeated_pipeline_and_a_choice_run_as_steps(): void
    {
        $pipelines = new Pipelines(new Container());

        $counted = $pipelines->run(CountLastWordPipeline::class, new Words('one two three'), Counted::class);
        $nothing = $pipelines->run(CountLastWordPipeline::class, new Words(''), Counted::class);

        $this->assertSame([1, -1], [$counted->count, $nothing->count]);
    }
}
