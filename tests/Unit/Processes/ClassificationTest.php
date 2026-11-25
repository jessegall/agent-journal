<?php

declare(strict_types=1);

namespace Tests\Unit\Processes;

use App\Enums\CommandRules\CommandClass;
use App\Enums\CommandRules\CommandType;
use App\Enums\CommandRules\OutputRequirement;
use App\Enums\CommandRules\UnresolvedType;
use App\Values\AgentText;
use App\Values\ClassFact;
use App\Values\Classification;
use App\Values\CommandClassSet;
use App\Values\PartClassification;
use App\Values\RuleOrigin;
use App\Values\SyntaxOrigin;
use App\Values\UnresolvedFact;
use Tests\Support\Processes\ParsesBashLines;
use Tests\TestCase;

/**
 * A classification unions the facts of its parts and redirects, keeps where each came from, and stays unknown while
 * anything is unresolved.
 */
final class ClassificationTest extends TestCase
{
    use ParsesBashLines;

    private const string VERIFICATION_LABEL = 'Tests and checks';

    public function test_a_redirect_writes_while_the_program_reads_each_on_its_own_node(): void
    {
        $tree = $this->parse('cat a > b');
        $cat = $tree->executableParts()[0];
        $classification = new Classification(
            $tree,
            [$this->part($cat->id, CommandClass::Read)],
            [new ClassFact(CommandClass::Write, $cat->id, new SyntaxOrigin('redirect'), 'the > redirect writes b')],
        );

        $this->assertSame([CommandClass::Read, CommandClass::Write], $classification->requiredClasses()->classes);
        $this->assertSame($cat->id, $classification->factsFor(CommandClass::Write)[0]->node);
        $this->assertSame('syntax:redirect', $classification->factsFor(CommandClass::Write)[0]->origin->reference());
        $this->assertTrue($classification->changesFiles());
    }

    public function test_a_chain_requires_the_union_of_its_parts(): void
    {
        $tree = $this->parse('cat a && rm a');
        [$cat, $rm] = $tree->executableParts();
        $classification = new Classification(
            $tree,
            [$this->part($cat->id, CommandClass::Read), $this->part($rm->id, CommandClass::Delete)],
            [],
        );

        $this->assertSame([CommandClass::Read, CommandClass::Delete], $classification->requiredClasses()->classes);
        $this->assertTrue($classification->isKnown());
        $this->assertFalse($classification->needsAlias());
    }

    public function test_an_unresolved_fact_keeps_the_command_unknown_and_needing_an_alias(): void
    {
        $tree = $this->parse('frobnicate --all');
        $node = $tree->executableParts()[0]->id;
        $reason = AgentText::of('core.shell.no_rule_for_program', ['program' => 'frobnicate']);
        $unknown = new PartClassification(
            $node,
            [],
            [new UnresolvedFact(UnresolvedType::UnknownProgram, $node, $reason)],
            CommandType::Unknown,
        );
        $classification = new Classification($tree, [$unknown], []);

        $this->assertFalse($classification->isKnown());
        $this->assertSame(UnresolvedType::UnknownProgram, $classification->unresolved()[0]->type);
        $this->assertTrue($classification->changesFiles());
        $this->assertTrue($classification->needsAlias());
    }

    public function test_class_sets_hold_exact_members_and_a_check_keeps_its_whole_output(): void
    {
        $granted = CommandClassSet::of(CommandClass::Edit, CommandClass::Read);
        $wanted = CommandClassSet::of(CommandClass::Write, CommandClass::Read);

        $this->assertFalse($granted->contains(CommandClass::Write));
        $this->assertSame([CommandClass::Write], $wanted->missingFrom($granted)->classes);
        $this->assertSame(self::VERIFICATION_LABEL, CommandClass::Verification->label());
        $this->assertSame(
            OutputRequirement::Full,
            new PartClassification(0, [], [], CommandType::Verification)->outputRequirement(),
        );
        $this->assertSame(
            OutputRequirement::Ordinary,
            new PartClassification(0, [], [], CommandType::Ordinary)->outputRequirement(),
        );
    }

    private function part(int $node, CommandClass $class): PartClassification
    {
        return new PartClassification(
            $node,
            [new ClassFact($class, $node, new RuleOrigin('fixture', 1), 'declared')],
            [],
            CommandType::Ordinary,
        );
    }
}
