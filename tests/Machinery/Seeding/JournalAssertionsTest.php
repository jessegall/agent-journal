<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Sessions\Enums\SessionStatus;
use PHPUnit\Framework\AssertionFailedError;
use Tests\Support\Assertions\Assert;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\TestJournal;
use Tests\TestCase;

/**
 * The journal's facts are asserted as Inertia asserts a page: where, has, count and missing pass on the truth and fail
 * naming the fact's path; a scope fails on a fact nobody touched unless it ends in etc(), and the root does not.
 */
#[TestsMachinery(TestJournal::class)]
final class JournalAssertionsTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Writer');
    }

    public function test_where_passes_on_the_value_and_on_a_check_that_holds(): void
    {
        $this->journal->assertJournal(fn (Assert $journal) => $journal
            ->where('agents.Writer.name', 'Writer')
            ->where('agents.Writer.session.status', SessionStatus::Active)
            ->where('agents.Writer.name', fn (string $name) => str_starts_with($name, 'Wr')));
    }

    public function test_where_fails_naming_the_path_of_the_fact(): void
    {
        $this->journal->assertRefused(
            AssertionFailedError::class,
            fn () => $this->journal->assertJournal(fn (Assert $journal) => $journal
                ->where('agents.Writer.name', 'Reader')),
            fn (AssertionFailedError $failure) => $this->assertStringContainsString(
                'agents.Writer.name',
                $failure->getMessage(),
            ),
        );
    }

    public function test_has_scopes_into_a_subject_and_a_missing_key_fails_naming_the_keys_there_are(): void
    {
        $this->journal
            ->assertJournal(fn (Assert $journal) => $journal
                ->has('agents.Writer.session', fn (Assert $session) => $session
                    ->where('status', SessionStatus::Active)
                    ->etc()))
            ->assertRefused(
                AssertionFailedError::class,
                fn () => $this->journal->assertJournal(fn (Assert $journal) => $journal->has('agents.Nobody')),
                fn (AssertionFailedError $failure) => $this->assertStringContainsString('Writer', $failure->getMessage()),
            );
    }

    public function test_count_counts_and_scopes_the_first_item(): void
    {
        $this->journal->assertJournal(fn (Assert $journal) => $journal
            ->count('agents', 1, fn (Assert $writer) => $writer->where('name', 'Writer')->etc()));
    }

    public function test_missing_passes_on_an_empty_fact_and_fails_on_a_present_one(): void
    {
        $this->journal
            ->assertJournal(fn (Assert $journal) => $journal->missing('agents.Writer.session.silentSince'))
            ->assertRefused(
                AssertionFailedError::class,
                fn () => $this->journal->assertJournal(fn (Assert $journal) => $journal->missing('agents.Writer.name')),
            );
    }

    public function test_an_untouched_fact_fails_its_scope_and_etc_lets_it_pass(): void
    {
        $this->journal
            ->assertRefused(
                AssertionFailedError::class,
                fn () => $this->journal->assertJournal(fn (Assert $journal) => $journal
                    ->has('agents.Writer', fn (Assert $writer) => $writer->where('name', 'Writer'))),
                fn (AssertionFailedError $failure) => $this->assertStringContainsString('session', $failure->getMessage()),
            )
            ->assertJournal(fn (Assert $journal) => $journal
                ->has('agents.Writer', fn (Assert $writer) => $writer->where('name', 'Writer')->etc()));
    }

    public function test_the_root_passes_the_facts_it_does_not_touch(): void
    {
        $this->journal->assertJournal(fn (Assert $journal) => $journal->has('agents.Writer'));
    }

    public function test_a_fact_is_read_only_when_it_is_asked_for(): void
    {
        $queries = $this->journal->queriesDuring(
            fn () => $this->journal->assertJournal(fn (Assert $journal) => $journal
                ->where('agents.Writer.name', 'Writer')),
        );

        $this->journal->assertResult(0, $queries);
    }

    public function test_value_reads_a_fact_without_counting_as_an_assertion(): void
    {
        $this->journal->assertJournal(fn (Assert $journal) => $journal
            ->has('agents.Writer', fn (Assert $writer) => $writer
                ->where('name', $writer->value('name'))
                ->etc()));
    }
}
