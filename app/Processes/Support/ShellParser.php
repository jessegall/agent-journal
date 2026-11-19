<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Processes\Contracts\CommandClassifier;
use App\Processes\Contracts\ShellCommandParser;
use App\Processes\Contracts\ShellSyntax;
use App\Processes\Enums\CommandEffect;
use App\Processes\Enums\CommandType;
use App\Processes\Enums\ParseOutcome;
use App\Processes\Enums\PartJoin;
use App\Processes\Enums\ShellDialect;
use App\Processes\Values\ClassFact;
use App\Processes\Values\Classification;
use App\Processes\Values\CommandPart;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\PartClassification;
use App\Processes\Values\ShellCommand;
use App\Processes\Values\ShellNode;
use App\Processes\Values\ShellTree;
use App\Processes\Values\Word;

/**
 * Reads a shell line through the syntax tree and the classifier (doc 21, section 4): each executable part becomes a
 * part with its program, its arguments and the effect and type its classification gives. It reads only the line
 * itself, so no flag a program sends can make a command look saved or safe. A word only known when the line runs
 * leaves the line not fully read.
 */
final readonly class ShellParser implements ShellCommandParser
{
    public function __construct(private ShellSyntax $syntax, private CommandClassifier $classifier) {}

    public function parse(string $line, ShellDialect $dialect): ShellCommand
    {
        $tree = $this->syntax->parse($line, $dialect);

        if (! $tree->outcome->isComplete()) {
            return new ShellCommand($line, $dialect, $tree->outcome, []);
        }

        $folder = (string) getcwd();
        $classification = $this->classifier->classify($tree, new ExecutionContext($dialect, $folder, $folder));
        $parts = array_map(
            fn (PartClassification $part): CommandPart => $this->partOf($tree, $classification, $part),
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

        return $dynamic ? ParseOutcome::DynamicExpansion : ParseOutcome::Complete;
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
        while (! $node->isRoot) {
            $parent = $tree->node($node->parent);
            $join = $parent->type->partJoin();
            if ($join !== null && ! $this->isLastChild($parent, $node)) {
                return $join;
            }
            $node = $parent;
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
            fn (ClassFact $fact): bool => $fact->class->isFileChange(),
        );

        return $changesFiles ? CommandEffect::ChangesFiles : CommandEffect::ReadsOnly;
    }

    private function isLastChild(ShellNode $parent, ShellNode $node): bool
    {
        return $parent->children !== [] && $parent->children[count($parent->children) - 1] === $node->id;
    }
}
