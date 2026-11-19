<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Pipelines\Contracts\Pipe;
use App\Pipelines\Contracts\PipelineDefinition;
use App\Pipelines\Support\PipelineAdapter;
use App\Pipelines\Support\Pipelines;
use ReflectionClass;
use ReflectionNamedType;
use Tests\Architecture\Support\DomainFiles;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A pipeline is the definition of a run of steps, or the adapter that runs one; a pipe is one step and never runs a
 * pipeline, not even through a service it is given (user messages 5572, 5578, 5585, 5609). Nesting, repetition and
 * choice are steps of a definition: a nested pipeline, or a Step listed inline.
 */
#[TimeLimit(seconds: 15, reason: 'It reads every class of Core, the domains and the module fixtures.')]
final class PipelineRulesTest extends TestCase
{
    /**
     * The verbs a pipeline's name may start with; a new pipeline that does something else adds its verb here.
     */
    private const array VERBS = [
        'Analyse', 'Build', 'Check', 'Count', 'Find', 'Read', 'Resolve', 'Run', 'Scan', 'Write',
    ];

    public function test_every_class_named_a_pipeline_is_a_definition_and_no_pipe(): void
    {
        $wronglyNamed = array_values(array_filter(
            self::classes(),
            fn (string $class): bool => str_ends_with($class, 'Pipeline')
                && (is_subclass_of($class, Pipe::class) || ! is_subclass_of($class, PipelineDefinition::class)),
        ));

        $this->assertSame([], $wronglyNamed);
    }

    /**
     * A pipeline's name says what it does: a verb and its object, such as ReadListPipeline (user message 5623).
     */
    public function test_every_pipeline_is_named_by_what_it_does(): void
    {
        $vague = [];

        foreach (self::classes() as $class) {
            $name = substr($class, strrpos($class, '\\') + 1);
            $startsWithVerb = preg_match('/^[A-Z][a-z]+/', $name, $firstWord) === 1
                && in_array($firstWord[0], self::VERBS, true);
            if (is_subclass_of($class, PipelineDefinition::class) && ! $startsWithVerb) {
                $vague[] = $class;
            }
        }

        $this->assertSame([], $vague);
    }

    public function test_no_pipe_runs_a_pipeline(): void
    {
        $running = [];

        foreach (self::classes() as $class) {
            $isAdapter = is_a($class, PipelineAdapter::class, true);
            if (is_subclass_of($class, Pipe::class) && ! $isAdapter && self::reachesPipelines($class, [])) {
                $running[] = $class;
            }
        }

        $this->assertSame([], $running);
    }

    /**
     * Whether the class, or a class it is given through its constructor at any depth, takes the pipeline runner or a
     * pipeline adapter.
     *
     * @param  class-string  $class
     * @param  array<class-string, true>  $seen
     */
    private static function reachesPipelines(string $class, array $seen): bool
    {
        $seen[$class] = true;
        $constructor = new ReflectionClass($class)->getConstructor();

        foreach ($constructor?->getParameters() ?? [] as $parameter) {
            $type = $parameter->getType();
            if (! $type instanceof ReflectionNamedType || $type->isBuiltin()) {
                continue;
            }
            /**
             * @var class-string $given
             */
            $given = $type->getName();
            if ($given === Pipelines::class || is_subclass_of($given, PipelineAdapter::class)) {
                return true;
            }
            if (! isset($seen[$given]) && class_exists($given) && self::reachesPipelines($given, $seen)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @return list<class-string>
     */
    private static function classes(): array
    {
        $classes = [];
        $folders = [app_path(), ...DomainFiles::domainCode(), base_path('tests/Fixtures/Modules')];

        foreach (DomainFiles::in($folders) as $file) {
            $source = (string) file_get_contents($file);
            $namespace = preg_match('/^namespace ([^;]+);/m', $source, $namespaceMatch) === 1;
            $name = preg_match('/^(?:final |abstract )?(?:readonly )?class (\w+)/m', $source, $nameMatch) === 1;
            if ($namespace && $name) {
                /**
                 * @var class-string $class
                 */
                $class = $namespaceMatch[1].'\\'.$nameMatch[1];
                $classes[] = $class;
            }
        }

        return $classes;
    }
}
