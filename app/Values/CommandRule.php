<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\Settings\StoredValue;
use App\Declarations\VerificationContract;
use App\Enums\CommandType;
use App\Enums\OutputRequirement;
use App\Enums\ScopeType;
use App\Enums\ToolType;
use App\Exceptions\CommandRuleInvalid;
use App\Support\Stored\StoredCommandRule;
use App\Support\Stored\StoredExecutableBinding;
use App\Support\Stored\StoredRuleReference;
use App\Support\Stored\StoredRuleScope;
use App\Support\Stored\StoredVerificationContract;

/**
 * One declared behaviour of a program: which program and subcommands it
 * covers, the words it accepts, the classes it emits, its purpose and output requirement, the executable it trusts,
 * and who owns it at which revision. A project rule may replace exactly one other rule revision.
 */
final readonly class CommandRule implements StoredValue
{
    /**
     * @param  list<string>  $subcommands
     * @param  list<RuleReference>  $replaces  the one rule revision this rule replaces, or none
     * @param  list<VerificationContract>  $contracts  exactly one for a check or build, none otherwise
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
        public array $contracts = [],
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

        if ($purpose->outputRequirement() === OutputRequirement::Full) {
            throw CommandRuleInvalid::contractMissing($id);
        }

        return new self(
            $id,
            RuleScope::core(),
            $program,
            $subcommands,
            $arguments,
            $classes,
            $purpose,
            $purpose->outputRequirement(),
            self::usualBinding($program),
            1,
            [],
        );
    }

    /**
     * A Core test, check or build rule at revision 1, with the one contract its runs are judged by.
     *
     * @param  list<string>  $subcommands
     *
     * @throws CommandRuleInvalid
     */
    public static function forCheck(
        string $id,
        ProgramSpellings $program,
        array $subcommands,
        ArgumentGrammar $arguments,
        CommandClassSet $classes,
        CommandType $purpose,
        ToolType $tool,
    ): self {
        if (preg_match('/^[a-z0-9-]+(\.[a-z0-9-]+)+$/', $id) !== 1) {
            throw CommandRuleInvalid::id($id);
        }

        if ($purpose->outputRequirement() !== OutputRequirement::Full) {
            throw CommandRuleInvalid::contractWithoutCheck($id);
        }

        $binding = self::usualBinding($program);
        $contract = VerificationContract::unproven(implode(' ', [$program->family, ...$subcommands]), $tool, $binding);

        return new self(
            $id,
            RuleScope::core(),
            $program,
            $subcommands,
            $arguments,
            $classes,
            $purpose,
            OutputRequirement::Full,
            $binding,
            1,
            [],
            [$contract],
        );
    }

    /**
     * The rule as a proposal or an approved revision stores it, after the boundary validated it.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'scope' => StoredRuleScope::fromRuleScope($this->scope)->toArray(),
            'program' => $this->program->toArray(),
            'subcommands' => $this->subcommands,
            'arguments' => $this->arguments->toArray(),
            'classes' => $this->classes->toArray(),
            'purpose' => $this->purpose->value,
            'output_requirement' => $this->outputRequirement->value,
            'binding' => StoredExecutableBinding::fromBinding($this->binding)->toArray(),
            'revision' => $this->revision,
            'replaces' => array_map(fn (RuleReference $replaced): array => $replaced->toArray(), $this->replaces),
            'contracts' => array_map(
                fn (VerificationContract $contract): array => $contract->toArray(),
                $this->contracts,
            ),
        ];
    }

    /**
     * @param  array<string, mixed>  $fields  the shape toArray writes
     */
    public static function fromArray(array $fields): self
    {
        return self::fromStored(StoredCommandRule::from($fields));
    }

    public static function fromJson(string $json): self
    {
        return self::fromStored(StoredCommandRule::from(json_decode($json, true, flags: JSON_THROW_ON_ERROR)));
    }

    public static function listFromJson(string $json): array
    {
        return array_values(array_map(
            self::fromStored(...),
            StoredCommandRule::collect(json_decode($json, true, flags: JSON_THROW_ON_ERROR)),
        ));
    }

    /**
     * The rule its stored shape names.
     */
    private static function fromStored(StoredCommandRule $stored): self
    {
        return new self(
            $stored->id,
            $stored->scope->toRuleScope(),
            ProgramSpellings::fromArray($stored->program),
            $stored->subcommands,
            ArgumentGrammar::fromArray($stored->arguments),
            CommandClassSet::fromArray($stored->classes),
            $stored->purpose,
            $stored->outputRequirement,
            $stored->binding->toBinding(),
            $stored->revision,
            array_map(fn (StoredRuleReference $replaced) => $replaced->toReference(), $stored->replaces),
            array_map(fn (StoredVerificationContract $contract) => $contract->toContract(), $stored->contracts),
        );
    }

    /**
     * The digest of the stored rule, which binds a proposal's request id and an approved revision to this payload.
     */
    public function digest(): string
    {
        return hash('sha256', json_encode($this->toArray(), JSON_THROW_ON_ERROR));
    }

    /**
     * The canonical operation the rule covers: its program family and subcommands, such as git branch.
     */
    public function programFamily(): string
    {
        return $this->program->family;
    }

    public function operation(): string
    {
        return implode(' ', [$this->program->family, ...$this->subcommands]);
    }

    /**
     * Whether the rule's purpose carries a verification contract, so its approval names a proven reader.
     */
    public function hasContract(): bool
    {
        return $this->outputRequirement === OutputRequirement::Full;
    }

    private static function usualBinding(ProgramSpellings $program): ExecutableBinding
    {
        return ExecutableBinding::builtin($program->family, ['/usr/bin', '/bin', '/usr/local/bin']);
    }

    public function ownedBy(RuleScope $scope, int $revision): self
    {
        return $this->changed($scope, $this->binding, $revision, $this->replaces);
    }

    public function boundTo(ExecutableBinding $binding): self
    {
        return $this->changed($this->scope, $binding, $this->revision, $this->replaces);
    }

    /**
     * @throws CommandRuleInvalid
     */
    public function replacing(RuleReference $replaced): self
    {
        if ($this->scope->type !== ScopeType::Project) {
            throw CommandRuleInvalid::replacementOutsideProject($this->id);
        }

        return $this->changed($this->scope, $this->binding, $this->revision, [$replaced]);
    }

    /**
     * This rule with another owner, binding, revision or replacement, and everything else the same.
     *
     * @param  list<RuleReference>  $replaces
     */
    private function changed(RuleScope $scope, ExecutableBinding $binding, int $revision, array $replaces): self
    {
        return clone ($this, [
            'scope' => $scope,
            'binding' => $binding,
            'revision' => $revision,
            'replaces' => $replaces,
        ]);
    }

    /**
     * Whether the other rule is a revision of this one: the same id under the same owner.
     */
    public function isSameRuleAs(self $other): bool
    {
        return $this->id === $other->id && $this->scope->isSameOwner($other->scope);
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
