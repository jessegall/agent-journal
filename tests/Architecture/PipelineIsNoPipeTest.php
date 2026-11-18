<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Pipelines\Contracts\Pipe;
use Tests\Architecture\Support\DomainFiles;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A pipeline is the definition of a run of pipes, or the adapter that runs one, never a pipe itself (user message
 * 5572): no pipe is named a pipeline, so the word keeps one meaning.
 */
#[TimeLimit(seconds: 15, reason: 'It reads every class of Core, the domains and the module fixtures.')]
final class PipelineIsNoPipeTest extends TestCase
{
    public function test_no_class_named_a_pipeline_is_a_pipe(): void
    {
        $pipelinesThatArePipes = [];

        $folders = [app_path(), ...DomainFiles::domainCode(), base_path('tests/Fixtures/Modules')];

        foreach (DomainFiles::in($folders) as $file) {
            $class = self::classIn($file);

            if ($class !== null && str_ends_with($class, 'Pipeline') && is_subclass_of($class, Pipe::class)) {
                $pipelinesThatArePipes[] = $class;
            }
        }

        $this->assertSame([], $pipelinesThatArePipes);
    }

    private static function classIn(string $file): string|null
    {
        $source = (string) file_get_contents($file);
        $namespace = preg_match('/^namespace ([^;]+);/m', $source, $namespaceMatch) === 1;
        $name = preg_match('/^(?:final |abstract )?(?:readonly )?class (\w+)/m', $source, $nameMatch) === 1;

        return $namespace && $name ? $namespaceMatch[1].'\\'.$nameMatch[1] : null;
    }
}
