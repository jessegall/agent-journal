<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\CommandRules\NodeType;
use App\Enums\CommandRules\ParseOutcome;
use App\Enums\CommandRules\StepType;
use App\Enums\CommandRules\WordSegmentType;
use App\Enums\Processes\ShellDialect;
use App\Exceptions\ExecutionPlanRefused;
use App\Support\Syntax\TreeParser;
use App\Values\HereDocument;
use App\Values\PlanRedirect;
use App\Values\PlanStep;
use App\Values\PlanWord;
use App\Values\ShellNode;
use App\Values\ShellTree;
use App\Values\Word;

/**
 * Builds the steps of one execution plan from a syntax tree, numbering each shell context as it goes: a pipeline
 * member, subshell, background job, substitution or child shell gets a new one, the rest share their parent's.
 */
final class PlanBuilder
{
    /**
     * Builtins that change or read the shell's own context, run inside it rather than as a program.
     */
    private const array BUILTINS = [
        'cd',
        'pwd',
        'export',
        'unset',
        ':',
        'true',
        'false',
        'echo',
        'printf',
    ];

    private const array SHELLS = [
        'sh' => ShellDialect::Sh,
        'bash' => ShellDialect::Bash,
        'zsh' => ShellDialect::Zsh,
    ];

    private int $contexts = 0;

    /**
     * @param  list<string>  $positional  $1, $2 ... of the shell this tree runs in
     */
    public function __construct(
        private readonly ShellTree $tree,
        private readonly TreeParser $syntax,
        private readonly array $positional,
    ) {}

    /**
     * @throws ExecutionPlanRefused
     */
    public function root(): PlanStep
    {
        return $this->step($this->tree->root, $this->contexts);
    }

    private function step(int $nodeId, int $context): PlanStep
    {
        $node = $this->tree->node($nodeId);
        $runnable = $this->runnableChildren($node);

        if ($node->type === NodeType::Sequence && count($runnable) === 1) {
            return $this->step($runnable[0]->id, $context);
        }

        if (StepType::isControl($node->type)) {
            $control = StepType::ofControl($node->type);

            $children = array_map(
                fn (ShellNode $child) => $this->step(
                    $child->id,
                    $control->hasSeparateChildContexts() ? ++$this->contexts : $context,
                ),
                $runnable,
            );

            return PlanStep::from(
                ['type' => $control, 'node' => $node->id, 'context' => $context, 'children' => $children],
            );
        }

        if ($node->type !== NodeType::SimpleCommand) {
            throw ExecutionPlanRefused::unsupportedNode($node->type->value, $node->id);
        }

        return $this->command($node, $context);
    }

    private function command(ShellNode $node, int $context): PlanStep
    {
        $substitutions = array_values(
            array_filter(
                $this->tree->children($node->id),
                fn (ShellNode $child) => in_array(
                    $child->type,
                    [NodeType::CommandSubstitution, NodeType::ProcessSubstitution],
                    true,
                ),
            ),
        );

        $children = array_map(
            fn (ShellNode $substitution) => PlanStep::from([
                'type' => StepType::Substitution,
                'node' => $substitution->id,
                'context' => ++$this->contexts,
                'children' => array_map(
                    fn (ShellNode $inner) => $this->step($inner->id, $this->contexts),
                    $this->runnableChildren($substitution),
                ),
            ]),
            $substitutions,
        );

        $argv = array_map(fn (Word $word) => $this->planWord($word, $node, $substitutions), $node->words);

        $redirects = array_map(
            fn ($redirect) => new PlanRedirect(
                $redirect->descriptor,
                $redirect->type,
                $redirect->target instanceof HereDocument ? new PlanWord(
                    [$this->hereDocumentText($redirect->target)],
                ) : $this->planWord($redirect->target, $node, $substitutions),
            ),
            $node->redirects,
        );

        $assignments = $this->assignments($node, $substitutions);
        $program = $argv === [] ? null : $argv[0]->literal();

        if ($program !== null && array_key_exists(basename($program), self::SHELLS)) {
            return $this->shell($node, $context, $argv, $redirects, $children, self::SHELLS[basename($program)]);
        }

        $type = in_array($program, self::BUILTINS, true) ? StepType::Builtin : StepType::Command;

        return PlanStep::from([
            'type' => $type,
            'node' => $node->id,
            'context' => $context,
            'argv' => $argv,
            'redirects' => $redirects,
            'assignments' => $assignments,
            'children' => $children,
        ]);
    }

    /**
     * A literal sh -c, bash -c or zsh -c source lowered into a child shell: its first argument after the source is $0,
     * the rest are $1, $2 ...
     *
     * @param  list<PlanWord>  $argv
     * @param  list<PlanRedirect>  $redirects
     * @param  list<PlanStep>  $substitutions
     */
    private function shell(
        ShellNode $node,
        int $context,
        array $argv,
        array $redirects,
        array $substitutions,
        ShellDialect $dialect,
    ): PlanStep {
        $literals = array_map(fn (PlanWord $word) => $word->literal(), $argv);
        $source = array_search('-c', $literals, true) === 1 ? ($literals[2] ?? null) : null;

        if ($source === null || in_array(null, $literals, true)) {
            throw ExecutionPlanRefused::unsupportedNode('shell without a literal -c source', $node->id);
        }

        $arguments = array_values(array_filter(array_slice($literals, 3), 'is_string'));
        $inner = $this->syntax->parse($source, $dialect);

        if ($inner->outcome !== ParseOutcome::Complete) {
            throw ExecutionPlanRefused::incomplete();
        }

        $child = new self($inner, $this->syntax, array_slice($arguments, 1))->root();

        return PlanStep::from([
            'type' => StepType::Shell,
            'node' => $node->id,
            'context' => $context,
            'argv' => $argv,
            'redirects' => $redirects,
            'children' => [...$substitutions, $child],
            'zero' => $arguments[0] ?? '',
            'positional' => array_slice($arguments, 1),
        ]);
    }

    /**
     * @param  list<ShellNode>  $substitutions
     * @return array<string, PlanWord>
     */
    private function assignments(ShellNode $node, array $substitutions): array
    {
        $assignments = [];

        foreach ($this->tree->children($node->id) as $child) {
            if ($child->type !== NodeType::Assignment) {
                continue;
            }

            $word = $this->planWord($child->words[0], $node, $substitutions);
            $text = (string) $word->pieces[0];
            $name = strstr($text, '=', true);

            if ($name === false) {
                throw ExecutionPlanRefused::dynamicWord($child->id);
            }

            $assignments[$name] = new PlanWord([substr($text, strlen($name) + 1), ...array_slice($word->pieces, 1)]);
        }

        return $assignments;
    }

    /**
     * A word as its literal pieces and substitution references; a positional parameter is bound to its value, and any
     * other expansion can only be known when it runs.
     *
     * @param  list<ShellNode>  $substitutions
     */
    private function planWord(Word $word, ShellNode $node, array $substitutions): PlanWord
    {
        $pieces = [];

        foreach ($word->boundTo($this->positional)->segments as $segment) {
            if ($segment->type !== WordSegmentType::Expansion) {
                $pieces[] = $segment->text;

                continue;
            }

            $substitution = array_values(
                array_filter(
                    $substitutions,
                    fn (ShellNode $candidate) => $candidate->range->start === $segment->range->start,
                ),
            );

            if ($substitution === []) {
                throw ExecutionPlanRefused::dynamicWord($node->id);
            }

            $pieces[] = $substitution[0]->id;
        }

        return new PlanWord($pieces);
    }

    private function hereDocumentText(HereDocument $document): string
    {
        return substr($this->tree->source, $document->body->start, $document->body->end - $document->body->start);
    }

    /**
     * @return list<ShellNode>
     */
    private function runnableChildren(ShellNode $node): array
    {
        return array_values(
            array_filter(
                $this->tree->children($node->id),
                fn (ShellNode $child) => ! in_array(
                    $child->type,
                    [NodeType::Comment, NodeType::Redirect, NodeType::Assignment, NodeType::HereDocument],
                    true,
                ),
            ),
        );
    }
}
