<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\CommandType;
use App\Processes\Enums\OutputRequirement;
use App\Processes\Enums\ScopeType;
use App\Processes\Exceptions\CommandRuleInvalid;

/**
 * One declared behaviour of a program (doc 21 revision 3, sections 9 and 27): which program and subcommands it
 * covers, the words it accepts, the classes it emits, its purpose and output requirement, the executable it trusts,
 * and who owns it at which revision. A project rule may replace exactly one other rule revision.
 */
final readonly class CommandRule
{
    /**
     * @param  list<string>  $subcommands
     * @param  list<RuleReference>  $replaces  the one rule revision this rule replaces, or none
     */
    private function __construct(
        public string $id,
        public RuleScope $scope,
        public ProgramSpellings $program,
        public array $subcommands,
        public ArgumentGrammar $arguments,
        public CommandClassSet $classes,
        public CommandType $purpose,
        public OutputRequirement $outputRequirement,
        public ExecutableBinding $binding,
        public int $revision,
        public array $replaces,
    ) {}

    /**
     * A Core rule at revision 1, trusting the program in the usual install folders.
     *
     * @param  list<string>  $subcommands
     *
     * @throws CommandRuleInvalid
     */
    public static function forProgram(
        string $id,
        ProgramSpellings $program,
        array $subcommands,
        ArgumentGrammar $arguments,
        CommandClassSet $classes,
        CommandType $purpose = CommandType::Ordinary,
    ): self {
        if (preg_match('/^[a-z0-9-]+(\.[a-z0-9-]+)+$/', $id) !== 1) {
            throw CommandRuleInvalid::id($id);
        }

        return new self($id, RuleScope::core(), $program, $subcommands, $arguments, $classes, $purpose, $purpose->outputRequirement(), ExecutableBinding::builtin($program->family, ['/usr/bin', '/bin', '/usr/local/bin']), 1, []);
    }

    public function ownedBy(RuleScope $scope, int $revision): self
    {
        return new self($this->id, $scope, $this->program, $this->subcommands, $this->arguments, $this->classes, $this->purpose, $this->outputRequirement, $this->binding, $revision, $this->replaces);
    }

    public function boundTo(ExecutableBinding $binding): self
    {
        return new self($this->id, $this->scope, $this->program, $this->subcommands, $this->arguments, $this->classes, $this->purpose, $this->outputRequirement, $binding, $this->revision, $this->replaces);
    }

    /**
     * @throws CommandRuleInvalid
     */
    public function replacing(RuleReference $replaced): self
    {
        if ($this->scope->type !== ScopeType::Project) {
            throw CommandRuleInvalid::replacementOutsideProject($this->id);
        }

        return new self($this->id, $this->scope, $this->program, $this->subcommands, $this->arguments, $this->classes, $this->purpose, $this->outputRequirement, $this->binding, $this->revision, [$replaced]);
    }

    public function reference(): RuleReference
    {
        return new RuleReference($this->scope, $this->id, $this->revision);
    }

    public function replaces(self $other): bool
    {
        return array_any($this->replaces, fn (RuleReference $replaced): bool => $replaced->names($other));
    }

    /**
     * Whether this rule and the other cover the same program and subcommands, so their grammars must not overlap.
     */
    public function coversSameCommand(self $other): bool
    {
        return $this->program->family === $other->program->family && $this->subcommands === $other->subcommands;
    }

    /**
     * How many leading words the subcommands take, when the words start with them; -1 when they do not.
     *
     * @param  list<Word>  $words
     */
    public function subcommandLength(array $words): int
    {
        foreach ($this->subcommands as $index => $subcommand) {
            if (($words[$index] ?? null)?->literal() !== $subcommand) {
                return -1;
            }
        }

        return count($this->subcommands);
    }
}
