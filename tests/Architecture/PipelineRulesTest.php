<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Pipelines\Contracts\Pipe;
use App\Pipelines\Contracts\PipelineDefinition;
use App\Pipelines\Support\PipelineAdapter;
use App\Pipelines\Support\PipelineRunner;
use App\Reflection\Support\DeclaredType;
use App\Reflection\Support\ReflectedMethod;
use App\Reflection\Support\Reflector;
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
        'Analyse', 'Answer', 'Build', 'Check', 'Count', 'Find', 'Read', 'Resolve', 'Run', 'Scan', 'Write',
    ];

    public function test_every_class_named_a_pipeline_is_a_definition_and_no_pipe(): void
    {
        $wronglyNamed = array_values(array_filter(
            self::classes(),
            fn (string $class): bool => str_ends_with($class, 'Pipeline')
                && (Reflector::of($class)->isSubclassOf(Pipe::class)
                    || ! Reflector::of($class)->isSubclassOf(PipelineDefinition::class)),
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

            if (Reflector::of($class)->isSubclassOf(PipelineDefinition::class) && ! $startsWithVerb) {
                $vague[] = $class;
            }
        }

        $this->assertSame([], $vague);
    }

    public function test_no_pipe_runs_a_pipeline(): void
    {
        $running = [];

        foreach (self::classes() as $class) {
            $type = Reflector::of($class);
            $isAdapter = $type->is(PipelineAdapter::class);

            if ($type->isSubclassOf(Pipe::class) && ! $isAdapter && self::reachesPipelines($class, [])) {
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
        $parameters = Reflector::of($class)->constructor()
            ->map(fn (ReflectedMethod $constructor) => $constructor->parameters())
            ->getOrElse([]);

        foreach ($parameters as $parameter) {
            $type = $parameter->type()
                ->filter(fn (DeclaredType $declared) => $declared->isNamed() && ! $declared->isBuiltin());

            if ($type->isEmpty()) {
                continue;
            }

            $given = $type->get()->name();
            $givenType = Reflector::find($given);

            if ($given === PipelineRunner::class
                || $givenType->filter(fn (Reflector $found) => $found->isSubclassOf(PipelineAdapter::class))
                    ->isDefined()) {
                return true;
            }

            if (! isset($seen[$given])
                && Reflector::exists($given)
                && Reflector::of($given)->isClass()
                && self::reachesPipelines($given, $seen)) {
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
