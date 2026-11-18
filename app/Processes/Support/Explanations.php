<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Processes\Contracts\CommandClassifier;
use App\Processes\Contracts\ShellSyntax;
use App\Processes\Data\ExplainedNodeData;
use App\Processes\Data\ExplanationData;
use App\Processes\Enums\CommandClass;
use App\Processes\Enums\NodeType;
use App\Processes\Enums\ShellDialect;
use App\Processes\Values\ClassFact;
use App\Processes\Values\Classification;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\HereDocument;
use App\Processes\Values\PartClassification;
use App\Processes\Values\Redirect;
use App\Processes\Values\ShellNode;
use App\Processes\Values\ShellTree;
use App\Processes\Values\SourceRange;
use App\Processes\Values\UnresolvedFact;

/**
 * Builds the explanation of a shell line from its syntax tree, the one builder later phases add classes and proposal
 * hints to. It parses only: nothing is started or opened, here-document bodies are left out and no variable is
 * expanded, so no environment value can show.
 */
final readonly class Explanations
{
    private const int SNIPPET_BYTES = 200;

    public function __construct(private ShellSyntax $syntax, private CommandClassifier $classifier) {}

    public function explain(string $line, ShellDialect $dialect): ExplanationData
    {
        $tree = $this->syntax->parse($line, $dialect);
        $classification = $this->classifier->classify($tree, new ExecutionContext($dialect, base_path(), base_path()));

        return new ExplanationData(
            $tree->outcome->value,
            $tree->diagnostic?->reason,
            $tree->diagnostic?->position,
            count($tree->executableParts()),
            array_map(fn (ShellNode $node) => $this->nodeOf($tree, $node, $classification), array_values($tree->nodes)),
            array_map(fn (CommandClass $class): string => $class->value, $classification->requiredClasses()->classes),
            $classification->isKnown(),
        );
    }

    private function nodeOf(ShellTree $tree, ShellNode $node, Classification $classification): ExplainedNodeData
    {
        $snippet = $node->type === NodeType::HereDocument ? '(here-document body left out)' : self::safe($this->sliceWithoutBodies($tree, $node->range));
        $facts = array_values(array_filter($classification->facts(), fn (ClassFact $fact): bool => $fact->node === $node->id));
        $parts = array_values(array_filter($classification->parts, fn (PartClassification $part): bool => $part->node === $node->id));
        $program = $parts[0]->program ?? null;

        return new ExplainedNodeData(
            $node->id,
            $node->type->value,
            $node->isRoot ? null : $node->parent,
            $snippet,
            array_map(fn (Redirect $redirect) => $this->redirectOf($tree, $redirect), $node->redirects),
            $program === null ? '' : $program->family,
            $program === null ? '' : self::safe($program->original),
            array_values(array_unique(array_map(fn (ClassFact $fact): string => $fact->class->value, $facts))),
            array_map(fn (ClassFact $fact): string => "{$fact->class->value} from {$fact->origin->reference()}", $facts),
            array_map(fn (UnresolvedFact $fact): string => "{$fact->type->value}: {$fact->reason}", array_merge(...array_map(fn (PartClassification $part): array => $part->unresolved, $parts))),
        );
    }

    /**
     * The source of a range with every here-document body inside it replaced by a marker.
     */
    private function sliceWithoutBodies(ShellTree $tree, SourceRange $range): string
    {
        $text = '';
        $at = $range->start;
        foreach ($tree->nodes as $node) {
            if ($node->type !== NodeType::HereDocument || $node->range->start < $at || $node->range->end > $range->end) {
                continue;
            }
            $text .= substr($tree->source, $at, $node->range->start - $at).'(here-document body left out)';
            $at = $node->range->end;
        }

        return $text.substr($tree->source, $at, $range->end - $at);
    }

    private function redirectOf(ShellTree $tree, Redirect $redirect): string
    {
        $target = $redirect->target instanceof HereDocument ? "here-document ending at {$redirect->target->delimiter}" : self::safe($redirect->target->range->slice($tree->source));

        return "{$redirect->type->value} {$redirect->descriptor} {$target}";
    }

    /**
     * The text with control characters shown as escapes and cut to a readable length.
     */
    private static function safe(string $text): string
    {
        $escaped = addcslashes($text, "\0..\37\177");

        return strlen($escaped) > self::SNIPPET_BYTES ? substr($escaped, 0, self::SNIPPET_BYTES).'...' : $escaped;
    }
}
