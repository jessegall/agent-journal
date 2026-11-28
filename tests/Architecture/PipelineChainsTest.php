<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Pipelines\Support\PipelineValidator;
use Tests\Fixtures\Pipelines\Broken\CountDroppedCountPipeline;
use Tests\Fixtures\Pipelines\CountTextPipeline;

/**
 * Every pipeline's steps chain from its input to its output, read from their declarations without running them
 *; the validator is the one php artisan journal:pipelines runs.
 */
final class PipelineChainsTest extends TestCase
{
    public function test_every_pipeline_chains_from_its_input_to_its_output(): void
    {
        $validator = $this->app->make(PipelineValidator::class);

        $this->assertSame([], $validator->faultsOf($validator->pipelines()));
        $this->mockArtisan('journal:pipelines')->assertSuccessful();
    }

    public function test_every_pipe_form_chains_and_a_pipe_that_does_not_take_what_it_is_handed_is_named(): void
    {
        $validator = $this->app->make(PipelineValidator::class);

        $this->assertSame([], $validator->faultsOf([CountTextPipeline::class]));
        $this->assertSame(
            [
                'Tests\\Fixtures\\Pipelines\\Broken\\CountDroppedCountPipeline: Tests\\Fixtures\\Pipelines\\DropFirstWord '
                .'takes Tests\\Fixtures\\Pipelines\\Words, not Tests\\Fixtures\\Pipelines\\Counted',
                'Tests\\Fixtures\\Pipelines\\Broken\\CountDroppedCountPipeline: it hands out '
                .'Tests\\Fixtures\\Pipelines\\Words, not its declared Tests\\Fixtures\\Pipelines\\Counted',
            ],
            $validator->faultsOf([CountDroppedCountPipeline::class]),
        );
    }
}
