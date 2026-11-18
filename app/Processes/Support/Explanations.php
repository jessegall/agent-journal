<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Processes\Contracts\CommandClassifier;
use App\Processes\Contracts\ShellSyntax;
use App\Processes\Data\ExplainedNodeData;
use App\Processes\Data\ExplanationData;
use App\Processes\Data\HeldPartData;
use App\Processes\Declarations\VerificationContract;
use App\Processes\Enums\CommandClass;
use App\Processes\Enums\NodeType;
use App\Processes\Enums\RequestHoldReason;
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

    public function __construct(
        private ShellSyntax $syntax,
        private CommandClassifier $classifier,
        private ActiveRules $rules,
    ) {}

    public function explain(string $line, ShellDialect $dialect): ExplanationData
    {
        $tree = $this->syntax->parse($line, $dialect);
        $context = new ExecutionContext($dialect, base_path(), base_path());
        $classification = $this->classifier->classify($tree, $context);
        $nodes = array_map(
            fn (ShellNode $node) => $this->nodeOf($tree, $node, $classification),
            array_values($tree->nodes),
        );
        $classes = $classification->requiredClasses()->classes;

        return ExplanationData::from([
            'outcome' => $tree->outcome->value,
            'diagnostic' => $tree->diagnostic?->reason,
            'diagnosticPosition' => $tree->diagnostic?->position,
            'executableParts' => count($tree->executableParts()),
            'nodes' => $nodes,
            'requiredClasses' => array_map(fn (CommandClass $class): string => $class->value, $classes),
            'isKnown' => $classification->isKnown(),
            'held' => $this->heldParts($classification),
        ]);
    }

    /**
     * The parts that cannot run yet: an unknown one, or a test, check or build without an approved proven reader.
     * Nothing is pre-filled for them; the request explain opens for each names what is owed.
     *
     * @return list<HeldPartData>
     */
    private function heldParts(Classification $classification): array
    {
        $held = [];
        foreach ($classification->parts as $part) {
            $operation = $part->program === null ? 'unknown' : $part->program->family;
            if (! $part->isKnown()) {
                $code = $part->unresolved === [] ? 'command-unknown' : $part->unresolved[0]->type->value;
                $held[] = new HeldPartData($part->node, $code, $operation, RequestHoldReason::UnknownCommand->value);

                continue;
            }
            foreach ($part->contracts as $contract) {
                if ($contract->reader->isProven() || $this->rules->approvedFor($contract->operation) !== []) {
                    continue;
                }
                $reason = RequestHoldReason::ReaderRequired->value;
                $held[] = new HeldPartData($part->node, 'reader_required', $contract->operation, $reason);
            }
        }

        return $held;
    }

    private function nodeOf(ShellTree $tree, ShellNode $node, Classification $classification): ExplainedNodeData
    {
        $snippet = $node->type === NodeType::HereDocument
            ? '(here-document body left out)'
            : self::safe($this->sliceWithoutBodies($tree, $node->range));
        $facts = array_values(array_filter(
            $classification->facts(),
            fn (ClassFact $fact): bool => $fact->node === $node->id,
        ));
        $parts = array_values(array_filter(
            $classification->parts,
            fn (PartClassification $part): bool => $part->node === $node->id,
        ));
        $unresolved = array_merge(...array_map(fn (PartClassification $part): array => $part->unresolved, $parts));
        $contracts = $parts[0]->contracts ?? [];
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
            array_map(fn (ClassFact $fact): string => $fact->class->value.' from '.$fact->origin->reference(), $facts),
            array_map(fn (UnresolvedFact $fact): string => "{$fact->type->value}: {$fact->reason}", $unresolved),
            $parts === [] ? '' : $parts[0]->purpose->label(),
            array_merge(...array_map(fn (VerificationContract $item): array => $item->description(), $contracts)),
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
            $inside = $node->range->start >= $at && $node->range->end <= $range->end;
            if ($node->type !== NodeType::HereDocument || ! $inside) {
                continue;
            }
            $text .= substr($tree->source, $at, $node->range->start - $at).'(here-document body left out)';
            $at = $node->range->end;
        }

        return $text.substr($tree->source, $at, $range->end - $at);
    }

    private function redirectOf(ShellTree $tree, Redirect $redirect): string
    {
        $target = $redirect->target instanceof HereDocument
            ? "here-document ending at {$redirect->target->delimiter}"
            : self::safe($redirect->target->range->slice($tree->source));

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
