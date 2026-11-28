<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\CheckSignIn\CheckSignInCommand;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Enums\SessionProcessStatus;
use App\Models\Agents\AgentRuntime;
use App\Sessions\Enums\StartRefusalReason;
use App\Support\MountRules;
use Tests\Support\Agents\TestAgent;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * An account signed in by an accepted method in its own folder proves its start; one signed in elsewhere, by another
 * method or not at all ends the start stopped as not signed in.
 */
#[TestsCommand(CheckSignInCommand::class)]
final class CheckSignInTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'hosts',
        'host_processes',
        'host_instructions',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'session_processes',
        'session_requests',
        'inboxes',
        'inbox_members',
        'links',
        'users',
    ];

    public function test_only_an_accepted_sign_in_in_the_accounts_own_folder_proves_the_start(): void
    {
        $this->journal->owner()->chooseActiveAccounts()->showDriverArrangements()->enrollHost('Mac', [base_path()]);
        $answers = [
            'Signed' => fn (string $folder) => [
                'loggedIn' => true,
                'authMethod' => 'claude.ai',
                'configDirectory' => $folder,
            ],
            'Elsewhere' => fn () => [
                'loggedIn' => true,
                'authMethod' => 'claude.ai',
                'configDirectory' => '/other',
            ],
            'Keyed' => fn (string $folder) => [
                'loggedIn' => true,
                'authMethod' => 'api_key',
                'configDirectory' => $folder,
            ],
            'Out' => fn () => ['loggedIn' => false],
        ];
        $results = [];

        foreach ($answers as $agent => $answer) {
            $this->journal->idleAgent($agent);
            $this->journal->withAgent($agent, fn (TestAgent $probed) => $probed
                ->openRuntime('Mac', base_path())
                ->passBuildProbe($agent));
            $opened = $this->journal->openedRuntimeOf($agent);
            $start = $this->journal->startOfSession($opened->sessionId);

            $this->journal->asSystem(new CheckSignInCommand(
                $this->journal->hostProcessCalled("{$agent}-sign-in")->id,
                (string) json_encode($answer($start->directory)),
            ));

            $start->refresh();
            $results[$agent] = [
                $start->status,
                $start->refusal,
                AgentRuntime::query()->whereKey($opened->runtimeId)->sole()->hasProvenStart(),
            ];
        }

        $notSignedIn = [SessionProcessStatus::Stopped, StartRefusalReason::NotSignedIn->explanation(), false];
        $this->journal->assertResult(
            [
                'Signed' => [
                    SessionProcessStatus::Starting,
                    null,
                    true,
                ],
                'Elsewhere' => $notSignedIn,
                'Keyed' => $notSignedIn,
                'Out' => $notSignedIn,
            ],
            $results,
        );
    }

    public function test_a_proven_start_whose_next_process_is_refused_ends_with_the_refusal(): void
    {
        $this->journal->owner()
            ->chooseActiveAccounts()
            ->showDriverArrangements()
            ->arrangeContainedJournal()
            ->idleAgent('Boxed')
            ->enrollContainedHost('Box', [base_path()])
            ->readyDriverImagesOn('Box');
        $this->journal->withAgent('Boxed', fn (TestAgent $boxed) => $boxed
            ->openRuntime('Box', base_path(), driverType: DriverType::Terminal)
            ->passBuildProbe('Boxed'));
        $opened = $this->journal->openedRuntimeOf('Boxed');
        $start = $this->journal->startOfSession($opened->sessionId);
        $signedIn = ['loggedIn' => true, 'authMethod' => 'claude.ai', 'configDirectory' => MountRules::ACCOUNT_TARGET];

        $this->journal->forgetSecurityProfiles()->asSystem(new CheckSignInCommand(
            $this->journal->hostProcessCalled('Boxed-sign-in')->id,
            (string) json_encode($signedIn),
        ));

        $start->refresh();
        $this->journal->assertResult(
            [SessionProcessStatus::Stopped, true],
            [$start->status, str_contains((string) $start->refusal, 'outside the profiles folder')],
        );
    }
}
