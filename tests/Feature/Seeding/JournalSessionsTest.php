<?php

declare(strict_types=1);

namespace Tests\Feature\Seeding;

use App\Models\Access\EnvironmentUserGrant;
use App\Models\Agents\AgentSession;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\TestCase;

/**
 * An agent the journal starts twice has two named starts, each its own session; asking for "its session" then names the
 * ambiguity, and a start the test signs with is the one the journal made.
 */
final class JournalSessionsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_restarted_agent_has_two_named_starts_and_no_single_session(): void
    {
        $this->journal->owner()->idleAgent('Writer')->startSession('Writer', 'First')->startSession('Writer', 'Second');

        $this->assertNotSame($this->journal->sessionCalled('First')->id, $this->journal->sessionCalled('Second')->id);
        $this->assertSame(
            2,
            AgentSession::query()->where('agent_id', $this->journal->agentCalled('Writer')->id)->count(),
        );
        $this->expectExceptionObject(FixtureRefused::notOneStart('Writer', 2));
        $this->journal->sessionOf('Writer');
    }

    public function test_an_idle_agent_has_no_session(): void
    {
        $this->journal->owner()->idleAgent('Reader');

        $this->assertSame(0, AgentSession::query()->count());
        $this->expectExceptionObject(FixtureRefused::notOneStart('Reader', 0));
        $this->journal->startOf('Reader');
    }

    public function test_a_test_start_signs_with_the_credential_its_start_was_issued(): void
    {
        $this->journal->owner()->agent('Ada');

        $start = $this->journal->testStartCalled('Ada');

        $this->assertSame($this->journal->startOf('Ada')->token, $start->token);
        $this->assertSame($this->journal->sessionOf('Ada')->id, $start->session->id);
        $this->assertSame(1, AgentSession::query()->count());
    }

    public function test_an_environment_of_a_project_is_granted_to_a_user(): void
    {
        $this->journal->owner()->user('Sam')->project('Shop')->environment(
            'Staging',
            'Shop',
        )->grantEnvironment('Staging', 'Sam');

        $this->assertSame(
            $this->journal->projectCalled('Shop')->id,
            $this->journal->environmentCalled('Staging')->project_id,
        );
        $this->assertTrue(EnvironmentUserGrant::query()
            ->activeFor(
                $this->journal->userCalled('Sam')->id,
                $this->journal->environmentCalled('Staging')->id,
            )->exists());
    }
}
