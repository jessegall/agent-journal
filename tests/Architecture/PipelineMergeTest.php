<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Bus\Contracts\PipelineDefinition;
use Tests\Architecture\Support\PipelineUseScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A small pipeline that only one other pipeline runs is merged into it, so a reader need not open it to see its steps:
 * a pipeline with fewer than four pipes that is a step of exactly one pipeline and is named nowhere else is refused,
 * read from the syntax tree, with the pipeline to merge it into.
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of app and the domains.')]
final class PipelineMergeTest extends TestCase
{
    private const int FEWEST_PIPES = 4;

    public function test_no_small_pipeline_is_the_step_of_only_one_other(): void
    {
        $this->assertSame([], $this->mergeableIn([base_path('app'), ...glob(base_path('domain/*/src'), GLOB_ONLYDIR) ?: []]));
    }

    public function test_a_small_pipeline_one_other_runs_is_named_with_the_pipeline_to_merge_it_into(): void
    {
        $this->assertSame(
            [
                'Tests\Fixtures\Pipelines\Merged\DropTwoWordsPipeline has 2 pipes and only '
                .'Tests\Fixtures\Pipelines\Merged\CountAfterTwoWordsPipeline runs it: merge its pipes into that one',
            ],
            $this->mergeableIn([base_path('tests/Fixtures/Pipelines/Merged')]),
        );
    }

    /**
     * @param  list<string>  $folders
     * @return list<string>
     */
    private function mergeableIn(array $folders): array
    {
        $pipelines = [];
        $users = [];
        $named = [];

        foreach (ScanCache::findingsInFolders(new PipelineUseScan(), $folders) as $found) {
            foreach ($found as $finding) {
                [$subject, $verb, $object] = explode(' ', $finding, 3);
                match ($verb) {
                    'steps' => $users[$object][$subject] = true,
                    'names' => $named[$object] = true,
                    default => $pipelines[$subject] = true,
                };
            }
        }

        $faults = [];

        foreach (array_keys($pipelines) as $pipeline) {
            $runners = array_keys($users[$pipeline] ?? []);

            if (count($runners) !== 1 || isset($named[$pipeline])) {
                continue;
            }

            $definition = $this->app->make($pipeline);
            assert($definition instanceof PipelineDefinition);
            $count = count($definition->pipes());

            if ($count < self::FEWEST_PIPES) {
                $faults[] = "{$pipeline} has {$count} pipes and only {$runners[0]} runs it: merge its pipes into that one";
            }
        }

        sort($faults);

        return $faults;
    }
}
