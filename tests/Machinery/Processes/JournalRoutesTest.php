<?php

declare(strict_types=1);

namespace Tests\Machinery\Processes;

use App\Bus\Contracts\CommandClassifier;
use App\CommandRules\Enums\CommandClass;
use App\CommandRules\Enums\UnresolvedType;
use Domain\Documents\DocumentsDomain;
use Domain\Tasks\TasksDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Processes\ClassifiesLines;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A journal command is classified by the exact route it calls, and only this installation's journal is trusted.
 */
#[TestsMachinery(CommandClassifier::class)]
final class JournalRoutesTest extends TestCase
{
    use ClassifiesLines;
    use RefreshHookDatabase;

    /**
     * Tasks and Documents, whose console commands declare the routes classified here.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class, TasksDomain::class);
    }

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
