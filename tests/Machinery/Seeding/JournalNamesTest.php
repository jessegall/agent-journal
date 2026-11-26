<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Models\Access\User;
use App\Models\Agents\Agent;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\Enums\FixtureRefusalType;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\TestCase;

/**
 * The journal refuses a name it never arranged and a name already given to another actor, before it writes a row.
 */
final class JournalNamesTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_an_unknown_name_is_refused_naming_it(): void
    {
        $this->expectExceptionObject(FixtureRefused::missingAlias('user', 'Nobody', 'The journal'));

        $this->journal->owner()->userCalled('Nobody');
    }

    public function test_a_name_given_to_a_user_is_refused_for_an_agent_and_writes_nothing(): void
    {
        $this->journal->owner()->user('Sam');

        $this->assertThrows(
            fn () => $this->journal->agent('Sam'),
            fn (FixtureRefused $refused) => $refused->type === FixtureRefusalType::OccupiedAlias,
        );

        $this->assertSame(0, Agent::query()->count());
        $this->assertSame(1, User::query()->where('name', 'Sam')->count());
        $this->assertSame('Sam', $this->journal->userCalled('Sam')->name);
    }
}
