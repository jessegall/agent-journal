<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\CommandRules\StepType;
use App\Exceptions\ExecutionPlanRefused;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * One step of an execution plan: what it does, the syntax node it comes from, the shell context it runs in, and for a
 * command or builtin its arguments, redirects and assignments. Steps in the same context see each other's cd and
 * assignments; a pipeline member, subshell, substitution or child shell gets a copy.
 */
final class PlanStep extends Data
{
    /**
     * @param  list<PlanWord>  $argv
     * @param  list<PlanRedirect>  $redirects
     * @param  array<string, PlanWord>  $assignments
     * @param  list<PlanStep>  $children  substitutions first, in source order, before the command that uses them
     * @param  list<string>  $positional  $1, $2 ... of a child shell
     */
    public function __construct(
        public readonly StepType $type,
        public readonly int $node,
        public readonly int $context,
        #[DataCollectionOf(PlanWord::class)]
        public readonly array $argv = [],
        #[DataCollectionOf(PlanRedirect::class)]
        public readonly array $redirects = [],
        #[DataCollectionOf(PlanWord::class)]
        public readonly array $assignments = [],
        #[DataCollectionOf(PlanStep::class)]
        public readonly array $children = [],
        public readonly string $zero = '',
        public readonly array $positional = [],
    ) {}

    /**
     * The lowered source of a child shell step, its last child.
     */
    public function innerShell(): self
    {
        $inner = array_last($this->children);

        if ($inner instanceof self) {
            return $inner;
        }

        throw ExecutionPlanRefused::unsupportedNode('shell without a source', $this->node);
    }

    /**
     * Every step in run order: this one's children first, then the step itself.
     *
     * @return list<PlanStep>
     */
    public function flatten(): array
    {
        return [
            ...array_merge(...array_map(fn (self $child) => $child->flatten(), $this->children)),
            $this,
        ];
    }
}
