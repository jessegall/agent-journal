<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Enums\CommandRules\CommandClass;
use App\Enums\CommandRules\UnresolvedType;
use Tests\Support\Processes\ClassifiesLines;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A journal command is classified by the exact route it calls, and only this installation's journal is trusted.
 */
final class JournalRoutesTest extends TestCase
{
    use ClassifiesLines;
    use RefreshHookDatabase;

    public function test_a_read_route_reads_and_names_its_route(): void
    {
        $classification = $this->classify('journal task assigned');

        $this->assertSame(
            [CommandClass::Read, CommandClass::JournalOperation],
            $classification->requiredClasses()->classes,
        );
        $this->assertSame('rule:core.journal.task:assigned@1', $classification->facts()[0]->origin->reference());
    }

    public function test_a_write_route_is_a_journal_operation_and_a_file_reading_route_also_reads(): void
    {
        $this->assertSame(
            [CommandClass::JournalOperation],
            $this->classify('journal link add task:1 plan:2')->requiredClasses()->classes,
        );
        $this->assertSame(
            [CommandClass::Read, CommandClass::JournalOperation],
            $this->classify('journal doc make Title --file notes.md')->requiredClasses()->classes,
        );
    }

    public function test_an_unknown_verb_and_a_journal_elsewhere_are_unresolved(): void
    {
        $this->assertSame(
            UnresolvedType::UnknownSubcommand,
            $this->classify('journal task frobnicate')->unresolved()[0]->type,
        );
        $this->assertSame(
            UnresolvedType::UnresolvedExecutable,
            $this->classify('./fake/journal task assigned')->unresolved()[0]->type,
        );
        $this->assertSame(
            UnresolvedType::UnknownSubcommand,
            $this->classify('journal engine tick')->unresolved()[0]->type,
        );
    }
}
