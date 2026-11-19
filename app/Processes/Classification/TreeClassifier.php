<?php

declare(strict_types=1);

namespace App\Processes\Classification;

use App\Processes\Contracts\AliasReader;
use App\Processes\Contracts\CommandClassifier;
use App\Processes\Contracts\ShellSyntax;
use App\Processes\Enums\AnalysisLimit;
use App\Processes\Enums\CommandClass;
use App\Processes\Enums\CommandType;
use App\Processes\Enums\NodeType;
use App\Processes\Enums\ShellDialect;
use App\Processes\Enums\UnresolvedType;
use App\Processes\Enums\WordSegmentType;
use App\Processes\Rules\WrapperRules;
use App\Processes\Support\CommandRuleRegistry;
use App\Processes\Support\PackageScripts;
use App\Processes\Support\ProgramClassifiers;
use App\Processes\Support\ProgramNames;
use App\Processes\Values\AliasLookup;
use App\Processes\Values\AliasOrigin;
use App\Processes\Values\ClassFact;
use App\Processes\Values\Classification;
use App\Processes\Values\CommandRule;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\PartClassification;
use App\Processes\Values\ProgramIdentity;
use App\Processes\Values\RuleOrigin;
use App\Processes\Values\ScriptBody;
use App\Processes\Values\ScriptOrigin;
use App\Processes\Values\ShellNode;
use App\Processes\Values\ShellTree;
use App\Processes\Values\SyntaxOrigin;
use App\Processes\Values\UnresolvedFact;
use App\Processes\Values\Word;
use App\Processes\Values\WordSegment;
use App\Processes\Values\WrapperRule;

/**
 * Classifies every node of a shell tree (doc 21 revision 3, sections 5, 6, 8 and 26): each simple command by its
 * program's declared rule, a wrapper together with the child it runs, a literal sh -c source as a tree of its own,
 * each redirect and background job by what the syntax does, and everything it cannot place as an unresolved fact.
 * A pipe, negation or condition never exempts a child, and a line that could not be read is unknown as a whole.
 */
final readonly class TreeClassifier implements CommandClassifier
{
    /**
     * Assignments that change which program runs or how a shell starts; any of them leaves the part unresolved.
     */
    private const array CONTEXT_ASSIGNMENTS = [
        'PATH', 'BASH_ENV', 'ENV', 'IFS', 'SHELLOPTS', 'BASHOPTS', 'PROMPT_COMMAND', 'LD_PRELOAD', 'LD_LIBRARY_PATH', 'LD_AUDIT',
        'DYLD_INSERT_LIBRARIES', 'DYLD_LIBRARY_PATH', 'GIT_EXEC_PATH', 'GIT_DIR', 'GIT_CONFIG', 'GIT_CONFIG_GLOBAL', 'PERL5LIB',
        'PYTHONPATH', 'NODE_OPTIONS',
    ];

    private const array SHELL_DIALECTS = ['sh' => ShellDialect::Sh, 'dash' => ShellDialect::Sh, 'bash' => ShellDialect::Bash, 'zsh' => ShellDialect::Zsh];

    /**
     * Shell options that change nothing about which commands run.
     */
    private const array PLAIN_SHELL_OPTIONS = ['-e', '-u', '-x', '-eu', '-ex', '-eux', '-o'];

    private const array SOURCE_READERS = ['eval', 'source', '.', 'ksh', 'fish'];

    private const array FIND_CHILD_STARTS = ['-exec', '-execdir', '-ok', '-okdir'];

    public function __construct(
        private CommandRuleRegistry $rules,
        private ProgramNames $names,
        private RedirectFacts $redirects,
        private WrapperRules $wrappers,
        private ShellSyntax $syntax,
        private ProgramClassifiers $programClassifiers,
        private PackageScripts $scripts,
        private AliasReader $aliases,
    ) {}

    public function classify(ShellTree $tree, ExecutionContext $context): Classification
    {
        return $this->classifyTree($tree, 0, $context);
    }

    public function withCandidate(CommandRule $rule): self
    {
        return clone ($this, ['rules' => $this->rules->withRules($rule)]);
    }

    private function classifyTree(ShellTree $tree, int $depth, ExecutionContext $context): Classification
    {
        if ($tree->outcome->isUnreadable()) {
            $reason = $tree->diagnostic->reason ?? 'The line could not be read.';

            return new Classification($tree, [new PartClassification($tree->root, [], [new UnresolvedFact(UnresolvedType::UnsupportedSyntax, $tree->root, $reason)], CommandType::Unknown)], []);
        }
        $parts = [];
        $syntaxFacts = [];
        foreach ($tree->nodes as $node) {
            $syntaxFacts = [...$syntaxFacts, ...$this->redirects->factsOf($node), ...$this->backgroundFacts($node)];
            $parts = [...$parts, ...$this->partOf($tree, $node, $depth, $context)];
        }

        return new Classification($tree, $parts, $syntaxFacts);
    }

    /**
     * The part a node stands for: a simple command, an unsupported construct, or another node whose redirects are
     * unresolved; none for a node that only joins its children.
     *
     * @return list<PartClassification>
     */
    private function partOf(ShellTree $tree, ShellNode $node, int $depth, ExecutionContext $context): array
    {
        $unresolvedRedirects = $this->redirects->unresolvedOf($node);

        return match (true) {
            $node->type === NodeType::SimpleCommand => [$this->commandPart($tree, $node, $unresolvedRedirects, $depth, $context)],
            $node->type === NodeType::Unsupported => [new PartClassification($node->id, [], [new UnresolvedFact(UnresolvedType::UnsupportedSyntax, $node->id, 'This construct is not supported, so what it runs is unknown.'), ...$unresolvedRedirects], CommandType::Unknown)],
            $unresolvedRedirects !== [] => [new PartClassification($node->id, [], $unresolvedRedirects, CommandType::Unknown)],
            default => [],
        };
    }

    /**
     * @param  list<UnresolvedFact>  $unresolvedRedirects
     */
    private function commandPart(ShellTree $tree, ShellNode $node, array $unresolvedRedirects, int $depth, ExecutionContext $context): PartClassification
    {
        $unresolved = [...$this->assignmentFacts($tree, $node), ...$unresolvedRedirects];
        if ($node->words === []) {
            return new PartClassification($node->id, [], $unresolved, $unresolved === [] ? CommandType::Ordinary : CommandType::Unknown);
        }
        $part = $this->classifyWords($node->words, $node->id, $depth, $context);

        return new PartClassification($node->id, $part->facts, [...$part->unresolved, ...$unresolved], $unresolved === [] ? $part->purpose : CommandType::Unknown, $part->program, $part->contracts);
    }

    /**
     * One command given as its words, the program first: by its rule, or as a wrapper, a shell, find, or a reader of
     * source this analysis cannot see.
     *
     * @param  list<Word>  $words
     */
    private function classifyWords(array $words, int $node, int $depth, ExecutionContext $context): PartClassification
    {
        if ($words === []) {
            return new PartClassification($node, [], [], CommandType::Ordinary);
        }
        if (AnalysisLimit::Depth->isPassedBy($depth)) {
            return new PartClassification($node, [], [new UnresolvedFact(UnresolvedType::UnsupportedSyntax, $node, 'Wrappers and nested shells go deeper than the analysis allows.')], CommandType::Unknown);
        }
        $boundWords = array_map(fn (Word $word): Word => $word->boundTo($context->positional), $words);
        $program = $this->names->canonical($boundWords[0], $node, $this->rules->spellings());
        if ($program instanceof UnresolvedFact) {
            return new PartClassification($node, [], [$program], CommandType::Unknown);
        }
        $alias = $this->aliasOf($program, $boundWords, $context);
        if ($alias->isFound) {
            return $this->aliasPart($program, $alias, $boundWords, $node, $depth, $context);
        }
        $programClassifiers = $this->programClassifiers->for($program);
        if ($programClassifiers !== []) {
            return $programClassifiers[0]->classify($boundWords, $node, $program, $context);
        }
        $scripts = $this->scripts->scriptOf($program->family, $boundWords, $context->projectRoot);
        if ($scripts !== []) {
            return $this->scriptPart($program, $scripts[0], $node, $depth, $context);
        }
        $wrapper = $this->wrappers->byFamily()[$program->family] ?? null;

        return match (true) {
            in_array($program->family, self::SOURCE_READERS, true) => $this->unknown($node, $program, UnresolvedType::InterpretedSource, "{$program->family} runs source this analysis cannot see."),
            array_key_exists($program->family, self::SHELL_DIALECTS) => $this->shellPart($program, $boundWords, $node, $depth, $context),
            $program->family === 'find' => $this->findPart($program, $boundWords, $node, $depth, $context),
            $program->family === 'git' => $this->gitPart($program, $boundWords, $node),
            $wrapper !== null => $this->wrapperPart($wrapper, $program, $boundWords, $node, $depth, $context),
            default => $this->rulePart($program, $boundWords, $node),
        };
    }

    /**
     * @param  list<Word>  $words
     */
    private function rulePart(ProgramIdentity $program, array $words, int $node): PartClassification
    {
        $rule = $this->rules->match($program, array_slice($words, 1), $node);
        if ($rule instanceof UnresolvedFact) {
            return new PartClassification($node, [], [$rule], CommandType::Unknown, $program);
        }

        return new PartClassification($node, $this->ruleFacts($rule, $node), [], $rule->purpose, $program, $rule->contracts);
    }

    /**
     * Git with its global options read first (doc 21 revision 3, section 7): -C, --git-dir, --work-tree, --no-pager and
     * --no-optional-locks are passed over; options that change configuration, the executable path or the pager leave
     * the part unresolved, and an unknown global option never shifts the subcommand.
     *
     * @param  list<Word>  $words
     */
    private function gitPart(ProgramIdentity $program, array $words, int $node): PartClassification
    {
        $index = 1;
        while ($index < count($words) && str_starts_with((string) $words[$index]->literal(), '-')) {
            $option = (string) $words[$index]->literal();
            if (in_array($option, ['-C', '--git-dir', '--work-tree', '--namespace'], true)) {
                $index += 2;
            } elseif (in_array($option, ['--no-pager', '--no-optional-locks', '--bare', '--literal-pathspecs', '-P'], true) || preg_match('/^--(git-dir|work-tree|namespace)=/', $option) === 1) {
                $index++;
            } else {
                return $this->unknown($node, $program, UnresolvedType::UnknownOption, "The git option {$option} changes configuration, the executable or the pager, or is not declared.");
            }
        }

        return $this->rulePart($program, [$words[0], ...array_slice($words, $index)], $node);
    }

    /**
     * A package script (doc 21 revision 6, sections 67 and 68): each body line is read as a command of its own, an
     *
     * @-reference as the command it names, and the script's part is the union of its children with the purpose of the
     * first child that has one, never a purpose taken from the script's name. A Composer callback that is not declared
     * harmless is unknown.
     */
    private function scriptPart(ProgramIdentity $program, ScriptBody $script, int $node, int $depth, ExecutionContext $context): PartClassification
    {
        $children = [];
        foreach ($script->lines as $line) {
            if ($this->scripts->isHarmlessCallback($line)) {
                continue;
            }
            if (preg_match('/^[A-Za-z_\\\\]+::[A-Za-z_]+$/', $line) === 1) {
                $children[] = $this->unknown($node, $program, UnresolvedType::UnknownProgram, "The Composer callback {$line} in {$script->binding->reference()} is not declared.");

                continue;
            }
            $source = str_starts_with($line, '@') ? $this->referencedCommand($program->family, substr($line, 1)) : $line;
            $inner = $this->classifyTree($this->syntax->parse($source, ShellDialect::Bash), $depth + 1, $context);
            $facts = array_map(fn (ClassFact $fact) => new ClassFact($fact->class, $node, new ScriptOrigin($script->binding, $fact->origin), $fact->reason), $inner->facts());
            $contracts = array_merge(...array_map(fn (PartClassification $part): array => $part->contracts, $inner->parts));
            $children[] = new PartClassification($node, $facts, $inner->unresolved(), $this->purposeOf($inner->parts), $program, $contracts);
        }

        return ChildCommand::join($node, $program, [], [], $children);
    }

    /**
     * The saved alias a journal run <name> part names, or a missing lookup for any other part; a route of the journal
     * itself is never shadowed by an alias.
     *
     * @param  list<Word>  $words
     */
    private function aliasOf(ProgramIdentity $program, array $words, ExecutionContext $context): AliasLookup
    {
        $name = count($words) > 2 && $words[1]->literal() === 'run' ? $words[2]->literal() : null;
        if ($program->family !== 'journal' || $name === null) {
            return AliasLookup::missing('');
        }

        return $this->aliases->find($name, $context->projectKey());
    }

    /**
     * A saved alias (doc 21 revision 6, sections 10 and 68): its body is classified as a command of its own, with the
     * given arguments bound to $1, $2 ... as whole words, and every fact names the alias and its revision. An alias
     * that reaches itself again stops and names the aliases of the loop.
     *
     * @param  list<Word>  $words
     */
    private function aliasPart(ProgramIdentity $program, AliasLookup $alias, array $words, int $node, int $depth, ExecutionContext $context): PartClassification
    {
        if (in_array($alias->id, $context->aliases, true)) {
            $loop = implode(', ', [...$context->aliases, $alias->id]);

            return $this->unknown($node, $program, UnresolvedType::UnsupportedSyntax, "The saved aliases {$loop} run each other in a loop.");
        }
        $arguments = array_slice($words, 3);
        $values = array_map(fn (Word $word): string|null => $word->literal(), $arguments);
        if (in_array(null, $values, true) || count($values) > count($alias->arguments)) {
            return $this->unknown($node, $program, UnresolvedType::UnsupportedSyntax, "The saved alias {$alias->name} takes ".count($alias->arguments).' plain arguments ('.implode(', ', $alias->arguments).').');
        }
        $inner = $this->classifyTree($this->syntax->parse($alias->body, ShellDialect::Bash), $depth + 1, $context->insideAlias($alias->id, array_values(array_filter($values, 'is_string'))));
        $facts = array_map(fn (ClassFact $fact) => new ClassFact($fact->class, $node, new AliasOrigin($alias, $fact->origin), $fact->reason), $inner->facts());
        $contracts = array_merge(...array_map(fn (PartClassification $part): array => $part->contracts, $inner->parts));

        return new PartClassification($node, $facts, $inner->unresolved(), $this->purposeOf($inner->parts), $program, $contracts);
    }

    /**
     * What a find action word adds: -delete removes what it matches, the -fprint family writes a file.
     *
     * @return list<ClassFact>
     */
    private function findActionFacts(string $text, int $node, RuleOrigin $origin): array
    {
        return match (true) {
            $text === '-delete' => [new ClassFact(CommandClass::Delete, $node, $origin, 'find -delete removes what it matches.')],
            in_array($text, ['-fprint', '-fprint0', '-fprintf', '-fls'], true) => [new ClassFact(CommandClass::Write, $node, $origin, "find {$text} writes a file.")],
            default => [],
        };
    }

    /**
     * The command a Composer @-reference names: @php and @composer run those programs, any other name another script.
     */
    private function referencedCommand(string $manager, string $reference): string
    {
        $first = strtok($reference, ' ');

        return in_array($first, ['php', 'composer'], true) ? $reference : "{$manager} {$reference}";
    }

    /**
     * A wrapper's own options and NAME=value words, then its child, classified as a command of its own.
     *
     * @param  list<Word>  $words
     */
    private function wrapperPart(WrapperRule $wrapper, ProgramIdentity $program, array $words, int $node, int $depth, ExecutionContext $context): PartClassification
    {
        $own = array_map(fn (CommandClass $class) => new ClassFact($class, $node, new RuleOrigin("core.wrapper.{$wrapper->family}", 1), "{$wrapper->family} itself does it."), $wrapper->classes->classes);
        $unresolved = [];
        $index = 1;
        while ($index < count($words)) {
            $text = $words[$index]->literal();
            if ($text === '--') {
                $index++;

                break;
            }
            if ($wrapper->takesAssignments && $text !== null && preg_match('/^([A-Za-z_][A-Za-z0-9_]*)=/', $text, $match) === 1) {
                $unresolved = [...$unresolved, ...$this->contextAssignment($match[1], $node)];
                $index++;

                continue;
            }
            if ($text === null || ! str_starts_with($text, '-') || $text === '-') {
                break;
            }
            $option = $wrapper->optionFor($text);
            if ($option === []) {
                return $this->unknown($node, $program, UnresolvedType::UnknownWrapperOption, "{$wrapper->family} has no declared option {$text}.");
            }
            $index += $option[0]->takesValue() && ! $option[0]->carriesValue($text) ? 2 : 1;
        }
        $child = array_slice($words, $index + $wrapper->leadingOperands);
        if ($child === []) {
            return $this->defaultChildOf($wrapper, $program, $words[0], $node, $own, $unresolved, $depth, $context);
        }
        if ($wrapper->family === 'xargs' && array_key_exists((string) $child[0]->literal(), self::SHELL_DIALECTS)) {
            return $this->unknown($node, $program, UnresolvedType::InterpretedSource, 'xargs inserts its input into the shell source, which is not known here.');
        }

        return ChildCommand::join($node, $program, $own, $unresolved, [$this->classifyWords($child, $node, $depth + 1, $context)]);
    }

    /**
     * A wrapper with no child: xargs runs echo when echo is declared; any other wrapper only does its own part.
     *
     * @param  list<ClassFact>  $own
     * @param  list<UnresolvedFact>  $unresolved
     */
    private function defaultChildOf(WrapperRule $wrapper, ProgramIdentity $program, Word $programWord, int $node, array $own, array $unresolved, int $depth, ExecutionContext $context): PartClassification
    {
        if ($wrapper->family !== 'xargs') {
            return ChildCommand::join($node, $program, $own, $unresolved, []);
        }
        $echo = new Word([new WordSegment(WordSegmentType::Literal, 'echo', $programWord->range)], $programWord->range);

        return ChildCommand::join($node, $program, $own, $unresolved, [$this->classifyWords([$echo], $node, $depth + 1, $context)]);
    }

    /**
     * sh, bash or zsh -c with a literal source: the source is read as a tree of its own in that dialect and its parts
     * join the shell's part. A shell without -c runs a script or its input, which this analysis cannot see.
     *
     * @param  list<Word>  $words
     */
    private function shellPart(ProgramIdentity $program, array $words, int $node, int $depth, ExecutionContext $context): PartClassification
    {
        $index = 1;
        while ($index < count($words) && in_array($words[$index]->literal(), self::PLAIN_SHELL_OPTIONS, true)) {
            $index += $words[$index]->literal() === '-o' ? 2 : 1;
        }
        if (($words[$index] ?? null)?->literal() !== '-c') {
            return $this->unknown($node, $program, UnresolvedType::InterpretedSource, "{$program->family} runs a script, a here-document or its input, which are not read here.");
        }
        $source = ($words[$index + 1] ?? null)?->literal();
        if ($source === null) {
            return $this->unknown($node, $program, UnresolvedType::DynamicWord, "The source given to {$program->family} -c is only known when it runs.");
        }
        $inner = $this->classifyTree($this->syntax->parse($source, self::SHELL_DIALECTS[$program->family]), $depth + 1, $context);
        $source = new PartClassification($node, $inner->facts(), $inner->unresolved(), $this->purposeOf($inner->parts), $program);

        return ChildCommand::join($node, $program, [], [], [$source]);
    }

    /**
     * find reads the tree it walks; -delete deletes, -fprint writes, and each -exec, -execdir, -ok or -okdir runs a
     * child up to its ; or + terminator, with {} as a forwarded operand.
     *
     * @param  list<Word>  $words
     */
    private function findPart(ProgramIdentity $program, array $words, int $node, int $depth, ExecutionContext $context): PartClassification
    {
        $origin = new RuleOrigin('core.find', 1);
        $own = [new ClassFact(CommandClass::Read, $node, $origin, 'find reads the folders it walks.')];
        $children = [];
        for ($index = 1; $index < count($words); $index++) {
            $text = (string) $words[$index]->literal();
            if (in_array($text, self::FIND_CHILD_STARTS, true)) {
                $end = $this->findChildEnd($words, $index + 1);
                if ($end < 0 || $end === $index + 1) {
                    return $this->unknown($node, $program, UnresolvedType::UnknownWrapperOption, "find {$text} has no command ended by ; or +.");
                }
                $children[] = $this->classifyWords(array_slice($words, $index + 1, $end - $index - 1), $node, $depth + 1, $context);
                $index = $end;

                continue;
            }
            $own = [...$own, ...$this->findActionFacts($text, $node, $origin)];
        }

        return ChildCommand::join($node, $program, $own, [], $children);
    }

    /**
     * The index of the ; or + that ends a find child, or -1 when none does.
     *
     * @param  list<Word>  $words
     */
    private function findChildEnd(array $words, int $from): int
    {
        for ($index = $from; $index < count($words); $index++) {
            if (in_array($words[$index]->literal(), [';', '+'], true)) {
                return $index;
            }
        }

        return -1;
    }

    /**
     * The purpose a group of parts serves together: the first purpose that is not ordinary.
     *
     * @param  list<PartClassification>  $parts
     */
    private function purposeOf(array $parts): CommandType
    {
        $special = array_values(array_filter($parts, fn (PartClassification $part): bool => $part->purpose !== CommandType::Ordinary));

        return $special === [] ? CommandType::Ordinary : $special[0]->purpose;
    }

    private function unknown(int $node, ProgramIdentity $program, UnresolvedType $type, string $reason): PartClassification
    {
        return new PartClassification($node, [], [new UnresolvedFact($type, $node, $reason)], CommandType::Unknown, $program);
    }

    /**
     * @return list<ClassFact>
     */
    private function ruleFacts(CommandRule $rule, int $node): array
    {
        return array_map(fn (CommandClass $class) => new ClassFact($class, $node, new RuleOrigin($rule->id, $rule->revision), "The rule {$rule->id} declares it."), $rule->classes->classes);
    }

    /**
     * @return list<UnresolvedFact>
     */
    private function assignmentFacts(ShellTree $tree, ShellNode $node): array
    {
        $unresolved = [];
        foreach ($tree->children($node->id) as $child) {
            $name = $child->type === NodeType::Assignment ? strstr((string) $child->words[0]->literal(), '=', true) : false;
            $unresolved = $name === false ? $unresolved : [...$unresolved, ...$this->contextAssignment(rtrim($name, '+'), $node->id)];
        }

        return $unresolved;
    }

    /**
     * @return list<UnresolvedFact>
     */
    private function contextAssignment(string $name, int $node): array
    {
        if (! in_array($name, self::CONTEXT_ASSIGNMENTS, true) && ! str_starts_with($name, 'BASH_FUNC_')) {
            return [];
        }

        return [new UnresolvedFact(UnresolvedType::UnresolvedExecutable, $node, "Setting {$name} changes which program runs or how it starts.")];
    }

    /**
     * @return list<ClassFact>
     */
    private function backgroundFacts(ShellNode $node): array
    {
        return $node->type === NodeType::Background ? [new ClassFact(CommandClass::ProcessControl, $node->id, new SyntaxOrigin('background'), 'A background job keeps running after the line ends.')] : [];
    }
}
