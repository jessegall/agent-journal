<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\CheckSignIn\CheckSignInCommand;
use App\Enums\Agents\SessionProcessStatus;
use App\Enums\Sessions\HostRefusal;
use App\Models\Agents\AgentRuntime;
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
        'hosts', 'host_processes', 'host_orders', 'agents', 'agent_sessions', 'session_tokens', 'agent_stacks',
        'hook_calls', 'agent_runtimes', 'driver_requests', 'driver_turns', 'accounts', 'active_accounts',
        'session_processes', 'session_requests', 'inboxes', 'inbox_members', 'links', 'users',
    ];

    public function test_only_an_accepted_sign_in_in_the_accounts_own_folder_proves_the_start(): void
    {
        $this->journal->owner()->chooseActiveAccounts()->showDriverArrangements()->enrollHost('Mac', [base_path()]);
        $answers = [
            'Signed' => fn (string $folder) => ['loggedIn' => true, 'authMethod' => 'claude.ai', 'configDirectory' => $folder],
            'Elsewhere' => fn () => ['loggedIn' => true, 'authMethod' => 'claude.ai', 'configDirectory' => '/other'],
            'Keyed' => fn (string $folder) => ['loggedIn' => true, 'authMethod' => 'api_key', 'configDirectory' => $folder],
            'Out' => fn () => ['loggedIn' => false],
        ];
        $results = [];

        foreach ($answers as $agent => $answer) {
            $this->journal->idleAgent($agent);
            $opened = $this->journal->openRuntimeOn($agent, 'Mac', base_path());
            $this->journal->passBuildProbe($agent, $opened->runtimeId);
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

        $notSignedIn = [SessionProcessStatus::Stopped, HostRefusal::NotSignedIn->explanation(), false];
        $this->journal->assertResult(
            [
                'Signed' => [SessionProcessStatus::Starting, null, true],
                'Elsewhere' => $notSignedIn,
                'Keyed' => $notSignedIn,
                'Out' => $notSignedIn,
            ],
            $results,
        );
    }
}
