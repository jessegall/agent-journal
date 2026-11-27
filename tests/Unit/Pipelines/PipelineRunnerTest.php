<?php

declare(strict_types=1);

namespace Tests\Unit\Pipelines;

use App\Pipelines\Exceptions\StepOutOfOrder;
use App\Pipelines\Support\BuiltSteps;
use App\Pipelines\Support\PipelineRunner;
use App\Pipelines\Support\Step;
use App\Reflection\CatalogueReflectorFactory;
use Illuminate\Container\Container;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Pipelines\AddOneToCount;
use Tests\Fixtures\Pipelines\Counted;
use Tests\Fixtures\Pipelines\CountIntoWordsPipeline;
use Tests\Fixtures\Pipelines\CountLastWordPipeline;
use Tests\Fixtures\Pipelines\CountTextPipeline;
use Tests\Fixtures\Pipelines\CountWords;
use Tests\Fixtures\Pipelines\CountWordsPipeline;
use Tests\Fixtures\Pipelines\DropFirstWord;
use Tests\Fixtures\Pipelines\Words;

/**
 * A pipeline hands each step's stage to the next, nests pipelines, repeats rounds and chooses steps, is resolved once
 * per request, runs steps listed inline, and names a step that stands out of order.
 */
final class PipelineRunnerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Container::setInstance(new Container());
    }

    protected function tearDown(): void
    {
        Container::setInstance(null);

        parent::tearDown();
    }

    public function test_each_pipe_turns_its_stage_into_the_next_and_the_pipeline_is_resolved_once(): void
    {
        CountWords::$built = 0;
        $pipelines = new PipelineRunner(new CatalogueReflectorFactory(), []);

        $first = $pipelines->run(CountWordsPipeline::class, new Words('three small words'), Counted::class);
        $second = $pipelines->run(CountWordsPipeline::class, new Words('two words'), Counted::class);

        $this->assertSame([3, 2], [$first->count, $second->count]);
        $this->assertSame(1, CountWords::$built);
    }

    public function test_a_new_request_builds_its_pipes_anew_so_no_pipe_carries_one_request_into_the_next(): void
    {
        CountWords::$built = 0;
        $container = Container::getInstance();
        $pipelines = new PipelineRunner(new CatalogueReflectorFactory(), []);

        $pipelines->run(CountWordsPipeline::class, new Words('one'), Counted::class);
        $pipelines->run(CountWordsPipeline::class, new Words('two'), Counted::class);
        $container->forgetScopedInstances();
        $pipelines->run(CountWordsPipeline::class, new Words('three'), Counted::class);

        $this->assertSame(2, CountWords::$built);
    }

    public function test_a_runner_made_before_a_request_builds_in_the_container_of_that_request(): void
    {
        $madeIn = Container::getInstance();
        $pipelines = new PipelineRunner(new CatalogueReflectorFactory(), []);
        $request = new Container();
        Container::setInstance($request);

        $counted = $pipelines->run(CountWordsPipeline::class, new Words('a b'), Counted::class);

        $this->assertSame(2, $counted->count);
        $this->assertTrue($request->resolved(BuiltSteps::class));
        $this->assertFalse($madeIn->resolved(BuiltSteps::class));
    }

    public function test_steps_listed_inline_run_in_order_with_no_definition_class(): void
    {
        $pipelines = new PipelineRunner(new CatalogueReflectorFactory(), []);

        $counted = $pipelines->runSteps([CountWords::class], new Words('three small words'), Counted::class);

        $this->assertSame(3, $counted->count);
        $this->expectException(StepOutOfOrder::class);
        $pipelines->runSteps([CountWords::class], new Words('a b'), Words::class);
    }

    public function test_a_conditional_step_with_no_else_lets_the_value_go_on_when_its_condition_fails(): void
    {
        $pipelines = new PipelineRunner(new CatalogueReflectorFactory(), []);
        $dropWhenLong = [
            Step::conditional(fn (Words $words) => str_word_count($words->text) > 2, then: DropFirstWord::class),
        ];

        $short = $pipelines->runSteps($dropWhenLong, new Words('two words'), Words::class);
        $long = $pipelines->runSteps($dropWhenLong, new Words('three small words'), Words::class);

        $this->assertSame(['two words', 'small words'], [$short->text, $long->text]);
    }

    public function test_a_pipe_handed_a_stage_it_does_not_take_is_named(): void
    {
        Container::getInstance()->bind(CountWordsPipeline::class, fn () => new CountWordsPipeline(times: 2));

        $this->expectException(StepOutOfOrder::class);
        $this->expectExceptionMessage(StepOutOfOrder::handing(CountWords::class, new Counted(0))->getMessage());

        new PipelineRunner(new CatalogueReflectorFactory(), [])->run(CountWordsPipeline::class, new Words('a b'), Counted::class);
    }

    public function test_a_run_that_ends_on_another_stage_is_named(): void
    {
        $this->expectException(StepOutOfOrder::class);
        $this->expectExceptionMessage(
            StepOutOfOrder::ending(CountWordsPipeline::class, Words::class, new Counted(0))->getMessage(),
        );

        new PipelineRunner(new CatalogueReflectorFactory(), [])->run(CountWordsPipeline::class, new Words('a b'), Words::class);
    }

    public function test_a_value_the_pipeline_does_not_take_is_refused_before_its_first_step(): void
    {
        $this->expectException(StepOutOfOrder::class);
        $this->expectExceptionMessage(
            StepOutOfOrder::entering(CountWordsPipeline::class, Words::class, new Counted(0))->getMessage(),
        );

        new PipelineRunner(new CatalogueReflectorFactory(), [])->run(CountWordsPipeline::class, new Counted(0), Counted::class);
    }

    public function test_a_pipeline_that_ends_on_another_type_than_it_declares_is_refused(): void
    {
        $this->expectException(StepOutOfOrder::class);
        $this->expectExceptionMessage(
            StepOutOfOrder::leaving(CountIntoWordsPipeline::class, Words::class, new Counted(2))->getMessage(),
        );

        new PipelineRunner(new CatalogueReflectorFactory(), [])->run(CountIntoWordsPipeline::class, new Words('a b'), Words::class);
    }

    public function test_a_nested_pipeline_a_repeated_pipeline_and_a_choice_run_as_steps(): void
    {
        $pipelines = new PipelineRunner(new CatalogueReflectorFactory(), []);

        $counted = $pipelines->run(CountLastWordPipeline::class, new Words('one two three'), Counted::class);
        $nothing = $pipelines->run(CountLastWordPipeline::class, new Words(''), Counted::class);

        $this->assertSame([1, -1], [$counted->count, $nothing->count]);
    }

    public function test_a_pipe_with_next_answers_without_the_rest_and_a_context_pipe_carries_its_value_on(): void
    {
        $pipelines = new PipelineRunner(new CatalogueReflectorFactory(), []);

        $empty = $pipelines->run(CountTextPipeline::class, new Words(''), Counted::class);
        $words = $pipelines->run(CountTextPipeline::class, new Words('two words'), Counted::class);

        $this->assertSame([0, 2], [$empty->count, $words->count]);
    }

    public function test_middleware_config_names_for_a_pipeline_runs_around_its_steps(): void
    {
        $pipelines = new PipelineRunner(new CatalogueReflectorFactory(), [CountTextPipeline::class => [AddOneToCount::class]]);

        $counted = $pipelines->run(CountTextPipeline::class, new Words('two words'), Counted::class);

        $this->assertSame(3, $counted->count);
    }
}
