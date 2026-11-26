<?php

declare(strict_types=1);

namespace App\Processes;

use App\Access\Values\ClassFact;
use App\Access\Values\ShellNode;
use App\Agents\Values\CommandPart;
use App\Bus\Contracts\CommandClassifier;
use App\CommandRules\Enums\CommandEffect;
use App\CommandRules\Enums\CommandType;
use App\CommandRules\Enums\ParseOutcome;
use App\Processes\Contracts\ShellCommandParser as ShellCommandParserContract;
use App\Processes\Enums\PartJoin;
use App\Processes\Enums\ShellDialect;
use App\Support\Syntax\TreeParser;
use App\Values\Classification;
use App\Values\ExecutionContext;
use App\Values\PartClassification;
use App\Values\ShellCommand;
use App\Values\ShellTree;
use App\Values\Word;

/**
 * Reads a shell line through the syntax tree and the classifier: each executable part gets its program, arguments,
 * effect and type. It reads only the line, so no flag can make a command look safe, and a word known only at run time
 * leaves the line not fully read.
 */
final readonly class ShellCommandParser implements ShellCommandParserContract
{
    public function __construct(private TreeParser $syntax, private CommandClassifier $classifier) {}

    public function parse(string $line, ShellDialect $dialect): ShellCommand
    {
        $tree = $this->syntax->parse($line, $dialect);

        if (! $tree->outcome->isComplete()) {
            return new ShellCommand($line, $dialect, $tree->outcome, []);
        }

        $folder = (string) getcwd();
        $classification = $this->classifier->classify($tree, new ExecutionContext($dialect, $folder, $folder));

        $parts = array_map(
            fn (PartClassification $part) => $this->partOf($tree, $classification, $part),
            $classification->parts,
        );

        return new ShellCommand($line, $dialect, $this->outcomeOf($tree), $parts);
    }

    /**
     * A line with a word only known when it runs is not fully read; an unknown program is read, but unknown.
     */
    private function outcomeOf(ShellTree $tree): ParseOutcome
    {
        $dynamic = array_any(
            $tree->executableParts(),
            fn (ShellNode $part): bool => array_any($part->words, fn (Word $word): bool => $word->hasExpansion()),
        );

        if ($dynamic) {
            return ParseOutcome::DynamicExpansion;
        }

        return ParseOutcome::Complete;
    }

    private function partOf(ShellTree $tree, Classification $classification, PartClassification $part): CommandPart
    {
        $argv = $classification->argvOf($part);

        return new CommandPart(
            $part->program === null ? '' : $part->program->original,
            array_slice($argv, 1),
            $this->effectOf($classification, $part),
            $part->isKnown() ? $part->purpose : CommandType::Unknown,
            $this->joinAfter($tree, $tree->node($part->node)),
        );
    }

    /**
     * How the part joins the command after it: the list operator of the nearest list in which it is not the last
     * command; the line's last command ends it.
     */
    private function joinAfter(ShellTree $tree, ShellNode $node): PartJoin
    {
        $current = $node;

        while (! $current->isRoot) {
            $parent = $tree->node($current->parent);
            $join = $parent->type->partJoin();

            if ($join !== null && ! $this->isLastChild($parent, $current)) {
                return $join;
            }

            $current = $parent;
        }

        return PartJoin::End;
    }

    /**
     * An unknown part may do anything; a known one changes files when its own classes do, or when the syntax inside it
     * does, such as a redirect that writes.
     */
    private function effectOf(Classification $classification, PartClassification $part): CommandEffect
    {
        if (! $part->isKnown()) {
            return CommandEffect::Unknown;
        }

        $changesFiles = array_any(
            $classification->factsOf($part),
            fn (ClassFact $fact) => $fact->class->isFileChange(),
        );

        if ($changesFiles) {
            return CommandEffect::ChangesFiles;
        }

        return CommandEffect::ReadsOnly;
    }

    private function isLastChild(ShellNode $parent, ShellNode $node): bool
    {
        return $parent->children !== [] && $parent->children[count($parent->children) - 1] === $node->id;
    }
}
