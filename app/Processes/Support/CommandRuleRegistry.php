<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Processes\Enums\UnresolvedType;
use App\Processes\Exceptions\CommandRuleConflict;
use App\Processes\Values\CommandRule;
use App\Processes\Values\ProgramIdentity;
use App\Processes\Values\ProgramSpellings;
use App\Processes\Values\RuleBundle;
use App\Processes\Values\UnresolvedFact;
use App\Processes\Values\Word;

/**
 * Every declared command rule, keyed by program family (doc 21 revision 3, sections 9 and 51). It is checked once when
 * built: one id has one owner unless a project rule replaces that exact revision, and rules covering the same program
 * and subcommands must be disjoint. Rules are kept in id order, so registration order never decides. A module's rules
 * wait for review and match nothing until then.
 */
final readonly class CommandRuleRegistry
{
    /**
     * @param  array<string, list<CommandRule>>  $active  family => active rules
     * @param  list<CommandRule>  $held  module rules waiting for review
     */
    private function __construct(private array $active, private array $held) {}

    /**
     * @param  list<CommandRule>  $rules
     * @param  list<CommandRule>  $approved  module rules whose bundle the project owner activated
     *
     * @throws CommandRuleConflict
     */
    public static function from(array $rules, array $approved = []): self
    {
        usort(
            $rules,
            fn (CommandRule $first, CommandRule $second): int => [$first->id, $first->scope->name()]
                <=> [$second->id, $second->scope->name()],
        );
        $standing = self::withoutReplaced($rules);
        self::checkIds($standing);
        self::assertDisjoint($standing);
        $active = [];
        $held = [];
        foreach ($standing as $rule) {
            if ($rule->scope->type->isActiveUnreviewed() || in_array($rule, $approved, true)) {
                $active[$rule->program->family][] = $rule;
            } else {
                $held[] = $rule;
            }
        }

        return new self($active, $held);
    }

    /**
     * This registry with more rules, checked as every rule is: a rule that overlaps an active one fails.
     *
     * @throws CommandRuleConflict
     */
    public function withRules(CommandRule ...$rules): self
    {
        $active = $this->activeRules();

        return self::from([...$active, ...$this->held, ...array_values($rules)], $active);
    }

    /**
     * This registry with the rules of the bundles the project owner activated taken out of review.
     *
     * @throws CommandRuleConflict
     */
    public function withApprovedBundles(RuleBundle ...$bundles): self
    {
        $active = $this->activeRules();
        $approved = array_merge([], ...array_map(fn (RuleBundle $bundle): array => $bundle->rules, $bundles));

        return self::from([...$active, ...$this->held], [...$active, ...$approved]);
    }

    /**
     * The rules waiting for review, one bundle per module and version.
     *
     * @return list<RuleBundle>
     */
    public function bundles(): array
    {
        $rules = [];
        foreach ($this->held as $rule) {
            $rules[$rule->scope->name()][] = $rule;
        }

        return array_values(array_map(
            fn (array $owned) => new RuleBundle($owned[0]->scope->owner, $owned[0]->scope->version, $owned),
            $rules,
        ));
    }

    /**
     * The digest of every active rule, which an admission records so a later change of the rules is seen.
     */
    public function revision(): string
    {
        $digests = array_map(fn (CommandRule $rule): string => $rule->digest(), $this->activeRules());
        sort($digests);

        return hash('sha256', implode("\n", $digests));
    }

    /**
     * Every rule an owner declares, active or waiting for review.
     *
     * @return list<CommandRule>
     */
    public function declaredRules(): array
    {
        return [...$this->activeRules(), ...$this->held];
    }

    /**
     * The one active rule that accepts the words after the program, or why none does.
     *
     * @param  list<Word>  $words
     */
    public function match(ProgramIdentity $program, array $words, int $node): CommandRule|UnresolvedFact
    {
        $rules = $this->active[$program->family] ?? [];
        if ($rules === []) {
            $problem = "No rule declares the program {$program->family}.";

            return new UnresolvedFact(UnresolvedType::UnknownProgram, $node, $problem);
        }
        $problem = "No rule of {$program->family} accepts these words.";
        $closest = new UnresolvedFact(UnresolvedType::UnknownSubcommand, $node, $problem);
        $closestLength = -1;
        foreach ($this->bySubcommandLength($rules) as $rule) {
            $length = $rule->subcommandLength($words);
            if ($length < 0) {
                continue;
            }
            $refusals = $rule->arguments->check(array_slice($words, $length), $node);
            if ($refusals === []) {
                return $rule;
            }
            if ($length > $closestLength) {
                [$closest, $closestLength] = [$refusals[0], $length];
            }
        }

        return $closest;
    }

    /**
     * The declared spellings of every program with an active rule, one per family.
     *
     * @return list<ProgramSpellings>
     */
    public function spellings(): array
    {
        return array_values(array_map(fn (array $rules): ProgramSpellings => $rules[0]->program, $this->active));
    }

    /**
     * Whether an active rule with a verification contract already covers the same program and subcommands.
     */
    public function coversAsCheck(CommandRule $rule): bool
    {
        $known = $this->active[$rule->program->family] ?? [];

        return array_any(
            $known,
            fn (CommandRule $other): bool => $other->coversSameCommand($rule) && $other->hasContract(),
        );
    }

    /**
     * @return list<CommandRule>
     */
    public function awaitingReview(): array
    {
        return $this->held;
    }

    /**
     * @return list<CommandRule>
     */
    private function activeRules(): array
    {
        return array_merge([], ...array_values($this->active));
    }

    /**
     * @param  list<CommandRule>  $rules
     * @return list<CommandRule>
     */
    private function bySubcommandLength(array $rules): array
    {
        usort(
            $rules,
            fn (CommandRule $first, CommandRule $second): int => count($second->subcommands)
                <=> count($first->subcommands),
        );

        return $rules;
    }

    /**
     * @param  list<CommandRule>  $rules
     * @return list<CommandRule>
     */
    private static function withoutReplaced(array $rules): array
    {
        return array_values(array_filter(
            $rules,
            fn (CommandRule $rule): bool => ! array_any(
                $rules,
                fn (CommandRule $other): bool => $other->replaces($rule),
            ),
        ));
    }

    /**
     * @param  list<CommandRule>  $rules
     *
     * @throws CommandRuleConflict
     */
    private static function checkIds(array $rules): void
    {
        $byId = [];
        foreach ($rules as $rule) {
            if (isset($byId[$rule->id])) {
                throw CommandRuleConflict::sameId($byId[$rule->id], $rule);
            }
            $byId[$rule->id] = $rule;
        }
    }

    /**
     * @param  list<CommandRule>  $rules
     *
     * @throws CommandRuleConflict
     */
    private static function assertDisjoint(array $rules): void
    {
        foreach ($rules as $index => $rule) {
            foreach (array_slice($rules, $index + 1) as $other) {
                if ($rule->coversSameCommand($other) && ! $rule->arguments->isDisjointFrom($other->arguments)) {
                    throw CommandRuleConflict::overlapping($rule, $other);
                }
            }
        }
    }
}
