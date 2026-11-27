<?php

declare(strict_types=1);

namespace Tests\States;

use App\Hooks\Enums\AnswerType;
use App\Models\Sessions\SessionPolicy;
use App\Models\Sessions\StopCheck;
use App\Sessions\Enums\StopCheckStatus;
use App\Sessions\States\ProfileState;
use App\Sessions\States\Support\ProfileStateReference;
use App\Sessions\Values\StartPolicy;
use App\Stacks\References\StateReference;
use Tests\Support\Assertions\StateAssert;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsState;
use Tests\Support\Seeding\StateHandle;
use Tests\TestCase;

/**
 * Every session's stack holds its profile state above the ready state for the whole session: a session with no frozen
 * policy stops freely, and a stop under a frozen policy with no stop conditions opens its attempt, which passes at once.
 */
#[TestsState(ProfileState::class)]
final class ProfileStateTest extends TestCase
{
    use CommitsHookRows;

    /**
     * Facts reach a stack once its change commits, so these tests commit and empty what they wrote.
     */
    private const array TABLES = ['agent_stacks', 'command_receipts', 'stop_checks', 'session_policies'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Writer');
    }

    public function test_a_session_with_no_frozen_policy_stops_freely_and_the_state_stays(): void
    {
        $this->journal->stateOn('Writer', $this->profile(), fn (StateHandle $profile) => $profile
            ->stop(fn (StateAssert $state) => $state
                ->stackAnswers(AnswerType::Allow)
                ->isLive()));

        $this->assertSame(0, StopCheck::query()->withoutGlobalScopes()->count());
    }

    public function test_a_stop_under_a_policy_with_no_conditions_passes_its_attempt_at_once(): void
    {
        SessionPolicy::create($this->journal->sessionOf('Writer'), StartPolicy::mainOnHost('/workspace'));

        $this->journal->stateOn('Writer', $this->profile(), fn (StateHandle $profile) => $profile
            ->stop(fn (StateAssert $state) => $state
                ->stackAnswers(AnswerType::Allow)
                ->isLive()));

        $this->assertSame(StopCheckStatus::Passed, StopCheck::query()->withoutGlobalScopes()->sole()->status);
    }

    private function profile(): StateReference
    {
        return ProfileStateReference::forSession($this->journal->sessionOf('Writer')->target);
    }
}
