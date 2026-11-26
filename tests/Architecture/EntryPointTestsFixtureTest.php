<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PHPUnit\Framework\TestCase;
use Tests\Architecture\Support\EntryPoints\EntryAttributes;
use Tests\Architecture\Support\EntryPoints\EntryPoint;
use Tests\Architecture\Support\EntryPoints\EntryTestFindings;
use Tests\Architecture\Support\EntryPoints\EntryType;
use Tests\Architecture\Support\EntryPoints\LoaderEntries;
use Tests\Architecture\Support\EntryPoints\NamedEntry;
use Tests\Architecture\Support\MachineryTests;
use Tests\Fixtures\EntryPointTests\TestedRead;
use Tests\Fixtures\EntryPointTests\UntestedRead;

/**
 * The entry test findings on fixture entries: an entry no test names is listed with what to write, a test at its
 * entry's path without the attribute with the attribute to add, a test outside its folder with the folder to move it
 * to, and a test of no kind with what to do about it.
 */
final class EntryPointTestsFixtureTest extends TestCase
{
    private const string SAVE = 'POST settings.save';

    public function test_a_read_with_no_test_and_a_read_test_in_the_wrong_folder_are_listed(): void
    {
        $misplacedTest = new NamedEntry(
            'tests/Machinery/TestedReadTest.php',
            'TestedReadTest',
            EntryType::Read,
            TestedRead::class,
        );
        $findings = new EntryTestFindings(
            [LoaderEntries::entryOf(UntestedRead::class), LoaderEntries::entryOf(TestedRead::class)],
            [$misplacedTest],
            [],
        );

        $this->assertSame([
            'The read Tests\\Fixtures\\EntryPointTests\\UntestedRead has no test: write one with #[TestsRead] at '
                .'tests/Reads/UntestedReadTest.php.',
        ], $findings->untested());
        $this->assertSame([
            'tests/Machinery/TestedReadTest.php tests the read Tests\\Fixtures\\EntryPointTests\\TestedRead: move '
                .'it to tests/Reads.',
        ], $findings->misplaced());
    }

    public function test_each_entry_no_test_names_is_listed_with_what_to_write(): void
    {
        $findings = new EntryTestFindings(
            [
                new EntryPoint(
                    EntryType::Command,
                    'App\\Commands\\Notes\\ArchiveNote',
                    'tests/Commands/Notes/ArchiveNoteTest.php',
                ),
                new EntryPoint(EntryType::State, 'App\\States\\Drafting', 'tests/States/DraftingTest.php'),
                new EntryPoint(EntryType::Route, 'POST settings.save', 'tests/Routes'),
                new EntryPoint(EntryType::McpTool, 'App\\Mcp\\Tools\\ReadTool', 'tests/Mcp'),
                new EntryPoint(EntryType::Hook, 'claude-code Stop', 'tests/Hooks'),
                new EntryPoint(EntryType::Middleware, 'App\\Http\\Middleware\\Gate', 'tests/Middleware/GateTest.php'),
            ],
            [],
            ['tests/States/DraftingTest.php'],
        );

        $this->assertSame([
            'The command App\\Commands\\Notes\\ArchiveNote has no test: write it at '
                .'tests/Commands/Notes/ArchiveNoteTest.php with #[TestsCommand].',
            'tests/States/DraftingTest.php tests the state App\\States\\Drafting without #[TestsState]: add it.',
            'The route method POST settings.save has no test: write it with php tests/bin/entry-tests.php --write.',
            'The MCP tool App\\Mcp\\Tools\\ReadTool has no test: write it with php tests/bin/entry-tests.php --write.',
            'The hook moment claude-code Stop has no test: name it with #[TestsHook] in a test under tests/Hooks.',
            'The middleware App\\Http\\Middleware\\Gate has no test: write it at tests/Middleware/GateTest.php with '
                .'#[TestsMiddleware].',
        ], $findings->untested());
    }

    public function test_a_test_outside_every_kind_is_listed_and_a_unit_or_stand_in_test_is_not(): void
    {
        $attributes = new EntryAttributes(base_path('tests/Fixtures/EntryPointTests/Kinds'));

        $this->assertSame(
            ['tests/Loose/LooseTest.php is a test of no kind: move what only it proves, then delete it.'],
            $attributes->ofNoKind(),
        );
    }

    public function test_a_machinery_test_naming_nothing_a_missing_class_or_an_entry_is_listed(): void
    {
        $tests = new MachineryTests(base_path('tests/Fixtures/EntryPointTests/Machinery'));

        $this->assertEqualsCanonicalizing([
            'tests/Machinery/CommandSubjectTest.php names App\\Commands\\Agents\\StartAgent\\StartAgentCommand, a command: '
                ."its proofs belong in that entry's test.",
            'tests/Machinery/MissingSubjectTest.php names App\\Support\\NoSuchEngine, which does not exist: name the '
                .'engine class it proves.',
            'tests/Machinery/UnnamedTest.php names no engine class: add #[TestsMachinery(...)] with the class it proves.',
        ], $tests->faults());
    }

    public function test_an_entry_two_test_classes_name_is_listed_with_both_files(): void
    {
        $findings = new EntryTestFindings([], [
            new NamedEntry('tests/Routes/Settings/SavePostTest.php', 'SavePostTest', EntryType::Route, self::SAVE),
            new NamedEntry('tests/Routes/Settings/OtherPostTest.php', 'OtherPostTest', EntryType::Route, self::SAVE),
            new NamedEntry('tests/Hooks/StopTest.php', 'StopTest', EntryType::Hook, 'claude-code Stop'),
            new NamedEntry('tests/Hooks/StopTest.php', 'StopTest', EntryType::Hook, 'claude-code SubagentStop'),
        ], []);

        $this->assertSame([
            'The route method POST settings.save is named by more than one test class, in '
                .'tests/Routes/Settings/SavePostTest.php, tests/Routes/Settings/OtherPostTest.php: keep one.',
        ], $findings->doubles());
    }
}
