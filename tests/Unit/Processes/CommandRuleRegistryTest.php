<?php

declare(strict_types=1);

namespace Tests\Unit\Processes;

use App\Contracts\Bus\PipelineRunner as PipelineRunnerContract;
use App\Contracts\Reflection\ReflectorFactory;
use App\Enums\CommandClass;
use App\Enums\OperandType;
use App\Enums\ShellDialect;
use App\Enums\UnresolvedType;
use App\Exceptions\CommandRuleConflict;
use App\Support\CatalogueReflectorFactory;
use App\Support\CommandRuleRegistry;
use App\Support\PipelineRunner;
use App\Support\Syntax\TreeParser;
use App\Values\ArgumentGrammar;
use App\Values\CommandClassSet;
use App\Values\CommandRule;
use App\Values\ProgramIdentity;
use App\Values\ProgramSpellings;
use App\Values\RuleReference;
use App\Values\RuleScope;
use App\Values\UnresolvedFact;
use Illuminate\Container\Container;
use Illuminate\Contracts\Container\Container as ContainerContract;
use PHPUnit\Framework\TestCase;

/**
 * Command rules are matched by their declared words, never by order or priority, and conflicting declarations stop
 * start-up naming both owners.
 */
final class CommandRuleRegistryTest extends TestCase
{
    private const string REQUIRED_OPTION_REASON = 'The option -D is required here.';

    public function test_the_list_and_delete_forms_of_git_branch_each_match_their_own_rule(): void
    {
        $registry = CommandRuleRegistry::from([$this->branchDelete(), $this->branchList()]);

        $this->assertSame('core.git.branch-list', $this->match($registry, 'git branch --show-current')->id);
        $this->assertSame('core.git.branch-delete', $this->match($registry, 'git branch -D old')->id);
    }

    public function test_registration_order_never_changes_the_winner(): void
    {
        $forward = CommandRuleRegistry::from([$this->branchList(), $this->branchDelete()]);
        $backward = CommandRuleRegistry::from([$this->branchDelete(), $this->branchList()]);

        $this->assertSame(
            $this->match($forward, 'git branch -D x')->id,
            $this->match($backward, 'git branch -D x')->id,
        );
    }

    public function test_words_no_rule_accepts_are_unresolved_and_never_pass(): void
    {
        $registry = CommandRuleRegistry::from([$this->branchList(), $this->branchDelete()]);

        $this->assertSame(UnresolvedType::UnknownOption, $this->refusal($registry, 'git branch --force')->type);
        $this->assertSame(self::REQUIRED_OPTION_REASON, $this->refusal($registry, 'git branch new-name')->reason);
        $this->assertSame(UnresolvedType::UnknownSubcommand, $this->refusal($registry, 'git frobnicate')->type);
        $this->assertSame(UnresolvedType::UnknownProgram, $this->refusal($registry, 'frob it')->type);
    }

    public function test_one_id_from_two_owners_stops_start_up_naming_both(): void
    {
        $module = $this->branchList()->ownedBy(RuleScope::module('acme', '2.0'), 1);

        $this->expectException(CommandRuleConflict::class);
        $this->expectExceptionMessage(CommandRuleConflict::sameId($module, $this->branchList())->getMessage());

        CommandRuleRegistry::from([$this->branchList(), $module]);
    }

    public function test_overlapping_rules_of_one_command_stop_start_up(): void
    {
        $alsoList = CommandRule::forProgram(
            'core.git.branch-show',
            new ProgramSpellings('git'),
            ['branch'],
            ArgumentGrammar::options(['--list']),
            CommandClassSet::of(CommandClass::Read),
        );

        $this->expectException(CommandRuleConflict::class);

        CommandRuleRegistry::from([$this->branchList(), $alsoList]);
    }

    public function test_a_project_replaces_a_module_rule_only_by_its_exact_owner_id_and_revision(): void
    {
        $module = $this->branchList()->ownedBy(RuleScope::module('acme', '2.0'), 3);
        $exact = $this->branchList()->ownedBy(RuleScope::project(), 1)->replacing(
            new RuleReference(RuleScope::module('acme', '2.0'), 'core.git.branch-list', 3),
        );
        $stale = $this->branchList()->ownedBy(RuleScope::project(), 1)->replacing(
            new RuleReference(RuleScope::module('acme', '2.0'), 'core.git.branch-list', 2),
        );

        $this->assertSame(
            'project',
            $this->match(CommandRuleRegistry::from([$module, $exact]), 'git branch')->scope->owner,
        );

        $this->expectException(CommandRuleConflict::class);
        CommandRuleRegistry::from([$module, $stale]);
    }

    public function test_a_module_rule_waits_for_review_before_it_matches(): void
    {
        $registry = CommandRuleRegistry::from([$this->branchList()->ownedBy(RuleScope::module('acme', '1.0'), 1)]);

        $this->assertCount(1, $registry->awaitingReview());
        $this->assertSame(UnresolvedType::UnknownProgram, $this->refusal($registry, 'git branch')->type);
    }

    private function branchList(): CommandRule
    {
        return CommandRule::forProgram(
            'core.git.branch-list',
            new ProgramSpellings('git'),
            ['branch'],
            ArgumentGrammar::options(['--list', '--show-current']),
            CommandClassSet::of(CommandClass::Read, CommandClass::VersionControl),
        );
    }

    private function branchDelete(): CommandRule
    {
        return CommandRule::forProgram(
            'core.git.branch-delete',
            new ProgramSpellings('git'),
            ['branch'],
            ArgumentGrammar::optionWithOperands('-D', OperandType::Branch),
            CommandClassSet::of(CommandClass::Read, CommandClass::Delete, CommandClass::VersionControl),
        );
    }

    private function match(CommandRuleRegistry $registry, string $line): CommandRule
    {
        $result = $this->lookUp($registry, $line);
        $this->assertInstanceOf(CommandRule::class, $result);

        return $result;
    }

    private function refusal(CommandRuleRegistry $registry, string $line): UnresolvedFact
    {
        $result = $this->lookUp($registry, $line);
        $this->assertInstanceOf(UnresolvedFact::class, $result);

        return $result;
    }

    private function lookUp(CommandRuleRegistry $registry, string $line): CommandRule|UnresolvedFact
    {
        $container = new Container();
        $container->bind(PipelineRunnerContract::class, PipelineRunner::class);
        $container->bind(ReflectorFactory::class, CatalogueReflectorFactory::class);
        $container->instance(ContainerContract::class, $container);
        $part = $container->make(TreeParser::class)->parse($line, ShellDialect::Bash)->executableParts()[0];

        return $registry->match(
            new ProgramIdentity((string) $part->words[0]->literal(), (string) $part->words[0]->literal()),
            array_slice($part->words, 1),
            $part->id,
        );
    }
}
