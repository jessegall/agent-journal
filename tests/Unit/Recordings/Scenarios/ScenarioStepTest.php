<?php

declare(strict_types=1);

namespace Tests\Unit\Recordings\Scenarios;

use App\Accounts\Commands\BeginSignIn\BeginSignInCommand;
use App\Accounts\Commands\SubmitSignInCode\SubmitSignInCodeCommand;
use App\Agents\Commands\DeliverAgent\DeliverAgentCommand;
use App\Agents\Commands\InterruptAgent\InterruptAgentCommand;
use App\Agents\Commands\StartAgent\StartAgentCommand;
use App\Agents\Commands\StopAgent\StopAgentCommand;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\Enums\DriverType;
use App\Recordings\Scenarios\Exceptions\ScenarioInvalid;
use App\Recordings\Scenarios\Scenario;
use App\Recordings\Scenarios\ScenarioRun;
use App\Sessions\Commands\ReleaseAgentHold\ReleaseAgentHoldCommand;
use App\Values\SignInChallenge;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Each session step builds the command the application sends for it, with the step's own fields; a start without a
 * model is refused when the file is read.
 */
final class ScenarioStepTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_each_session_step_builds_its_command_with_its_fields(): void
    {
        $this->journal->owner()->idleAgent('Coder');
        $coder = $this->journal->agentCalled('Coder');
        $scenario = Scenario::read('claude-code/turn', (string) json_encode(['steps' => [
            [
                'do' => 'start-session',
                'agent' => 'Coder',
                'type' => 'headless',
                'model' => 'claude-haiku-5-5',
                'effort' => 'low',
            ],
            ['do' => 'send-message', 'agent' => 'Coder', 'text' => 'Run: ls.'],
            ['do' => 'interrupt', 'agent' => 'Coder'],
            ['do' => 'release-hold', 'agent' => 'Coder'],
            ['do' => 'stop', 'agent' => 'Coder'],
        ]]));
        $agents = ['Coder' => $coder->id];
        $run = new ScenarioRun($scenario, $this->journal->ownerUser(), $agents, 'journal-runner@sha256:1');
        $drivers = $this->app->make(DriverCatalogue::class);

        $commands = array_map(function ($step) use ($run, $drivers) {
            $command = $step->commandFor($run, $drivers);
            $run->stepRan();

            return $command;
        }, $scenario->steps);

        [$start, $delivery, $interrupt, $release, $stop] = $commands;
        $this->assertInstanceOf(StartAgentCommand::class, $start);
        $this->assertInstanceOf(DeliverAgentCommand::class, $delivery);
        $this->assertSame(
            [
                ['claude-code', 'claude-haiku-5-5', 'low', DriverType::Headless, $coder->id],
                'scenario-claude-code-turn-'.$run->startedAt->format('YmdHisv').'-1',
                [InterruptAgentCommand::class, ReleaseAgentHoldCommand::class, StopAgentCommand::class],
            ],
            [
                [
                    $start->request->selection->driver,
                    $start->request->selection->model,
                    $start->request->selection->effort,
                    $start->request->driverType,
                    $start->request->agentId,
                ],
                $delivery->idempotencyKey,
                [$interrupt::class, $release::class, $stop::class],
            ],
        );
    }

    public function test_a_start_without_a_model_is_refused_when_read(): void
    {
        $this->expectException(ScenarioInvalid::class);
        $this->expectExceptionMessage('lacks model');

        $file = '{"steps":[{"do":"start-session","agent":"Coder","type":"terminal","effort":"low"}]}';

        Scenario::read('claude-code/turn', $file);
    }

    public function test_the_sign_in_steps_begin_a_sign_in_and_submit_the_code_the_user_typed(): void
    {
        $this->journal->owner();
        $scenario = Scenario::read('claude-code/sign-in', (string) json_encode(['steps' => [
            ['do' => 'sign-in', 'driver' => 'claude-code', 'method' => 'oauth'],
            ['do' => 'ask-user', 'text' => 'Sign in on the page and paste the code.'],
            ['do' => 'submit-code', 'from' => 'challenge'],
        ]]));
        $run = new ScenarioRun($scenario, $this->journal->ownerUser(), [], 'journal-runner@sha256:1');
        $drivers = $this->app->make(DriverCatalogue::class);

        $begin = $scenario->steps[0]->commandFor($run, $drivers);
        $run->stepRan();
        $pause = $scenario->steps[1]->pause(new SignInChallenge('https://example.test/sign-in', 'ABCD-EFGH'));
        $run->holdSignInAttempt('attempt-1');
        $run->holdSignInCode('code-1');
        $run->stepRan();
        $submit = $scenario->steps[2]->commandFor($run, $drivers);

        $this->assertInstanceOf(BeginSignInCommand::class, $begin);
        $this->assertInstanceOf(SubmitSignInCodeCommand::class, $submit);
        $this->assertSame(
            [
                'claude-code',
                'Sign in on the page and paste the code.',
                'https://example.test/sign-in',
                'ABCD-EFGH',
                'attempt-1',
                'code-1',
            ],
            [$begin->driver, $pause->text, $pause->signIn?->address, $pause->signIn?->code, $submit->attemptId, $submit->code],
        );
    }

    public function test_each_machine_step_is_the_program_line_the_record_script_runs(): void
    {
        $this->journal->owner();
        $scenario = Scenario::read('installation/fresh', (string) json_encode(['steps' => [
            ['do' => 'remove-image', 'image' => 'journal-runner:build'],
            ['do' => 'stop-daemon'],
            ['do' => 'start-daemon'],
            ['do' => 'install'],
            ['do' => 'update'],
        ]]));
        $run = new ScenarioRun($scenario, $this->journal->ownerUser(), [], 'journal-runner@sha256:1');

        $this->assertSame(
            [
                ['docker', 'compose', 'exec', '-T', 'agent-docker', 'docker', 'rmi', '--force', 'journal-runner:build'],
                ['docker', 'compose', 'stop', 'agent-docker'],
                ['docker', 'compose', 'start', 'agent-docker'],
                ['sh', 'scripts/local-host.sh', '--fresh'],
                ['sh', 'scripts/local-host.sh'],
            ],
            array_map(fn ($step) => $step->machineChange($run), $scenario->steps),
        );
    }
}
