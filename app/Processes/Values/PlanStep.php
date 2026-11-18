<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\StepType;
use App\Processes\Exceptions\ExecutionPlanRefused;

/**
 * One step of an execution plan: what it does, the syntax node it comes from, the shell context it runs in, and for a
 * command or builtin its arguments, redirects and assignments. Steps in the same context see each other's cd and
 * assignments; a pipeline member, subshell, substitution or child shell gets a copy.
 */
final readonly class PlanStep
{
    /**
     * @param  list<PlanWord>  $argv
     * @param  list<PlanRedirect>  $redirects
     * @param  array<string, PlanWord>  $assignments
     * @param  list<PlanStep>  $children  substitutions first, in source order, before the command that uses them
     * @param  list<string>  $positional  $1, $2 ... of a child shell
     */
    public function __construct(
        public StepType $type,
        public int $node,
        public int $context,
        public array $argv = [],
        public array $redirects = [],
        public array $assignments = [],
        public array $children = [],
        public string $zero = '',
        public array $positional = [],
    ) {}

    /**
     * The lowered source of a child shell step, its last child.
     */
    public function innerShell(): self
    {
        $inner = array_last($this->children);

        return $inner instanceof self ? $inner : throw ExecutionPlanRefused::unsupportedNode('shell without a source', $this->node);
    }

    /**
     * Every step in run order: this one's children first, then the step itself.
     *
     * @return list<PlanStep>
     */
    public function flatten(): array
    {
        return [...array_merge(...array_map(fn (self $child) => $child->flatten(), $this->children)), $this];
    }

    /**
     * The step as plain data for the host that runs it.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'type' => $this->type->value,
            'node' => $this->node,
            'context' => $this->context,
            'argv' => array_map(fn (PlanWord $word) => $word->toArray(), $this->argv),
            'redirects' => array_map(fn (PlanRedirect $redirect) => $redirect->toArray(), $this->redirects),
            'assignments' => array_map(fn (PlanWord $word) => $word->toArray(), $this->assignments),
            'children' => array_map(fn (self $child) => $child->toArray(), $this->children),
            'zero' => $this->zero,
            'positional' => $this->positional,
        ];
    }

    /**
     * @param  array<string, mixed>  $step
     */
    public static function fromArray(array $step): self
    {
        return new self(
            StepType::from($step['type']),
            $step['node'],
            $step['context'],
            array_values(array_map(PlanWord::fromArray(...), $step['argv'])),
            array_values(array_map(PlanRedirect::fromArray(...), $step['redirects'])),
            array_map(PlanWord::fromArray(...), $step['assignments']),
            array_values(array_map(self::fromArray(...), $step['children'])),
            $step['zero'],
            $step['positional'],
        );
    }
}
