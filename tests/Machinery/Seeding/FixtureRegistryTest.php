<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Support\DomainEntry;
use App\Support\DomainRegistry;
use Domain\Plans\PlansDomain;
use Illuminate\Support\Facades\DB;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\Fixtures\Modules\Notes\Tests\Fixtures\NoteFixtures;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Seeding\Enums\FixtureRefusalType;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\Support\Seeding\FixtureRegistry;
use Tests\Support\Seeding\TestJournal;
use Tests\TestCase;

/**
 * The fixture registry keeps each domain's own builders: one built object per class, a foreign or second registration
 * and a maker of the wrong type refused before anything is kept, and a class no booted domain registered refused by
 * name without a query.
 */
#[TestsMachinery(FixtureRegistry::class)]
final class FixtureRegistryTest extends TestCase
{
    public function test_a_builder_is_made_once_and_handed_the_journal(): void
    {
        $registry = $this->registry();
        $registry->register(
            $this->notes(),
            NoteFixtures::class,
            fn (TestJournal $journal) => new NoteFixtures($journal),
        );

        $first = $registry->fixtures(NoteFixtures::class, $this->journal);

        $this->assertSame($first, $registry->fixtures(NoteFixtures::class, $this->journal));
        $this->assertSame($this->journal, $first->journal);
    }

    public function test_a_foreign_or_second_registration_is_refused(): void
    {
        $registry = $this->registry();
        $plans = DomainEntry::fromClass(PlansDomain::class);
        $maker = fn (TestJournal $journal) => new NoteFixtures($journal);

        $this->assertThrows(
            fn () => $registry->register($plans, NoteFixtures::class, $maker),
            fn (FixtureRefused $refused) => $refused->type === FixtureRefusalType::Foreign,
        );
        $registry->register($this->notes(), NoteFixtures::class, $maker);
        $this->assertThrows(
            fn () => $registry->register($this->notes(), NoteFixtures::class, $maker),
            FixtureRefused::class,
            'twice',
        );
    }

    public function test_a_maker_of_the_wrong_type_keeps_nothing(): void
    {
        $registry = $this->registry();
        $registry->register($this->notes(), NoteFixtures::class, fn () => new \stdClass());

        $this->assertThrows(
            fn () => $registry->fixtures(NoteFixtures::class, $this->journal),
            fn (FixtureRefused $refused) => $refused->type === FixtureRefusalType::WrongResult,
        );
        $this->assertThrows(
            fn () => $registry->fixtures(NoteFixtures::class, $this->journal),
            fn (FixtureRefused $refused) => $refused->type === FixtureRefusalType::WrongResult,
        );
    }

    public function test_a_builder_of_a_domain_not_booted_is_refused_by_name_without_a_query(): void
    {
        $queries = 0;
        DB::listen(function () use (&$queries): void {
            $queries++;
        });

        $this->assertThrows(
            fn () => $this->journal->fixtures('Domain\\Plans\\Tests\\Fixtures\\PlanFixtures'),
            fn (FixtureRefused $refused) => $refused->type === FixtureRefusalType::DomainNotBooted,
        );
        $this->assertSame(0, $queries);
    }

    private function registry(): FixtureRegistry
    {
        return new FixtureRegistry($this->app->make(DomainRegistry::class));
    }

    private function notes(): DomainEntry
    {
        return DomainEntry::fromClass(NotesDomain::class);
    }
}
