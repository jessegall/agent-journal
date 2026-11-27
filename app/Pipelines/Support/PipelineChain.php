<?php

declare(strict_types=1);

namespace App\Pipelines\Support;

use App\Bus\Contracts\Pipable;
use App\Bus\Contracts\Pipe;
use App\Bus\Contracts\PipelineDefinition;
use App\Reflection\Contracts\ReflectorFactory;
use App\Support\DeclaredType;
use App\Support\Reflector;
use Illuminate\Contracts\Container\Container;
use PhpOption\Option;

/**
 * One pipeline's steps read from their declarations, from its input to its output: each pipe must take what the step
 * before carries, a pipe that takes $next must return the pipeline's output and hands on what it takes, and the last
 * value carried must be the declared output. Mixed and object stand for a type only a run can tell, and pass.
 */
final class PipelineChain
{
    /**
     * @var list<string>
     */
    private array $faults = [];

    /**
     * @param  PipelineDefinition<object, object>  $definition
     * @param  list<class-string<Pipe>>  $middleware
     */
    public function __construct(
        private readonly PipelineDefinition $definition,
        private readonly array $middleware,
        private readonly Container $container,
        private readonly ReflectorFactory $reflectors,
    ) {}

    /**
     * @return list<string>
     */
    public function faults(): array
    {
        $this->faults = [];
        $carried = $this->follow([...$this->middleware, ...$this->definition->pipes()], [$this->definition->input]);
        $output = $this->definition->output;

        foreach (array_filter($carried, fn (string $type) => ! self::accepts([$output], $type)) as $type) {
            $this->faults[] = $this->definition::class.": it hands out {$type}, not its declared {$output}";
        }

        return $this->faults;
    }

    /**
     * @param  list<class-string<Pipable>|Step>  $steps
     * @param  list<string>  $carried
     * @return list<string>
     */
    private function follow(array $steps, array $carried): array
    {
        return array_reduce($steps, fn (array $types, string|Step $step) => $this->through($step, $types), $carried);
    }

    /**
     * @param  class-string<Pipable>|Step  $step
     * @param  list<string>  $carried
     * @return list<string>
     */
    private function through(string|Step $step, array $carried): array
    {
        if ($step instanceof Step) {
            return $step->carriesOn($carried, $this->follow(...));
        }

        if ($this->reflectors->is($step, PipelineDefinition::class)) {
            $inner = $this->container->make($step);
            assert($inner instanceof PipelineDefinition);
            $this->checkTaken($step, [$inner->input], $carried);

            return [$inner->output];
        }

        $signature = PipeSignature::of($step);

        if (! $signature->takesContext) {
            $this->checkTaken($step, self::typeNames($signature->takes), $carried);
        }

        if (! $signature->takesNext) {
            return self::typeNames($signature->returns);
        }

        $output = $this->definition->output;

        foreach (self::typeNames($signature->returns) as $type) {
            if (! self::accepts([$output], $type)) {
                $this->faults[] = $this->definition::class.": {$step} returns {$type}, not the pipeline's output {$output}";
            }
        }

        return $carried;
    }

    /**
     * @param  list<string>  $taken
     * @param  list<string>  $carried
     */
    private function checkTaken(string $step, array $taken, array $carried): void
    {
        foreach (array_filter($carried, fn (string $type) => ! self::accepts($taken, $type)) as $type) {
            $this->faults[] = $this->definition::class.": {$step} takes ".implode('|', $taken).", not {$type}";
        }
    }

    /**
     * @param  list<string>  $taken
     */
    private static function accepts(array $taken, string $type): bool
    {
        if (self::isUnknown($type)) {
            return true;
        }

        return array_any(
            $taken,
            fn (string $accepted) => self::isUnknown($accepted)
                || $accepted === $type
                || (Reflector::exists($type) && in_array($accepted, Reflector::of($type)->typeNames(), true)),
        );
    }

    private static function isUnknown(string $type): bool
    {
        return in_array($type, ['mixed', 'object'], true);
    }

    /**
     * The names a declared type allows; mixed for a type not declared.
     *
     * @param  Option<DeclaredType>  $type
     * @return list<string>
     */
    private static function typeNames(Option $type): array
    {
        return $type->map(fn (DeclaredType $declared) => self::namesOf($declared))->getOrElse(['mixed']);
    }

    /**
     * @return list<string>
     */
    private static function namesOf(DeclaredType $type): array
    {
        if ($type->members !== []) {
            return array_merge(...array_map(self::namesOf(...), $type->members));
        }

        return [$type->name()];
    }
}
