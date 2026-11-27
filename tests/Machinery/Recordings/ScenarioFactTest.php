<?php

declare(strict_types=1);

namespace Tests\Machinery\Recordings;

use App\Recordings\Scenarios\Enums\ScenarioFact;
use App\Recordings\Scenarios\Scenario;
use App\Recordings\Scenarios\ScenarioRun;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Each fact answers only yes or no for the run as the journal holds it now: an installer that exited 0 with a host
 * enrolled is installed, a sign-in just started shows no challenge yet, and a session still running is not stopped.
 */
#[TestsMachinery(ScenarioFact::class)]
final class ScenarioFactTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_installed_needs_the_installer_to_exit_0_and_a_host_enrolled(): void
    {
        $run = $this->runOf([]);
        $before = ScenarioFact::Installed->isReached($run);
        $run->holdInstallerExit(1);
        $this->journal->enrollHost('Mac', [base_path()]);
        $failed = ScenarioFact::Installed->isReached($run);
        $run->holdInstallerExit(0);

        $this->assertSame([false, false, true], [$before, $failed, ScenarioFact::Installed->isReached($run)]);
    }

    public function test_a_sign_in_just_started_shows_no_challenge_and_is_not_signed_in(): void
    {
        $this->journal->beginSignIn('Claude', 'claude-code');
        $run = $this->runOf([]);
        $run->holdSignInAttempt($this->journal->signInCalled('Claude'));

        $this->assertSame(
            [false, false],
            [ScenarioFact::ChallengeShown->isReached($run), ScenarioFact::SignedIn->isReached($run)],
        );
    }

    public function test_a_running_session_is_not_stopped_and_its_turn_has_not_ended(): void
    {
        $this->journal->idleAgent('Coder')->startSession('Coder', 'Coder');
        $run = $this->runOf(['Coder' => $this->journal->agentCalled('Coder')->id]);
        $run->agentNamed('Coder');

        $this->assertSame(
            [false, false, false],
            [
                ScenarioFact::Stopped->isReached($run),
                ScenarioFact::TurnEnded->isReached($run),
                ScenarioFact::Interrupted->isReached($run),
            ],
        );
    }

    /**
     * @param  array<string, string>  $agents
     */
    private function runOf(array $agents): ScenarioRun
    {
        $scenario = Scenario::read('claude-code/turn', '{"steps":[]}');

        return new ScenarioRun($scenario, $this->journal->ownerUser(), $agents, 'journal-runner@sha256:1');
    }
}
