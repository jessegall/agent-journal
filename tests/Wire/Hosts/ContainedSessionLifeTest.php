<?php

declare(strict_types=1);

namespace Tests\Wire\Hosts;

use App\Agents\Drivers\Enums\DriverType;
use App\Hosts\Commands\StopHostProcess\StopHostProcessCommand;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessStatus;
use App\Hosts\Protocol\HostInstructionType;
use App\Models\Hosts\HostInstruction;
use App\Values\HostInstructionSource;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Assertions\Assert;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\OverTheWire;
use Tests\Support\Hosts\TestHost;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A Claude Code session on a contained host lives its whole life in its own container of the agent image, against
 * the mock Docker: its probes and its terminal open as containers, it answers its first message, and once
 * stopped its container is removed.
 */
#[OverTheWire]
#[TimeLimit(seconds: 60, reason: 'It runs the real host, the Docker mock and a served journal.')]
final class ContainedSessionLifeTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

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

    public function test_a_contained_claude_code_session_answers_in_its_own_container_and_is_removed_once_stopped(): void
    {
        $answered = fn (Assert $journal) => $journal
            ->where(
                'hostProcesses.terminal.rows',
                fn (array|null $rows) => in_array('done', array_map(trim(...), $rows ?? []), true),
            );

        $this->journal->owner()
            ->arrangeContainedJournal()
            ->showDriverArrangements()
            ->idleAgent('Terminal')
            ->enrollContainedHost('Box', [base_path()])
            ->runTestHost('Box', fn (TestHost $box) => $box->chooseActiveAccounts())
            ->withAgent('Terminal', fn (TestAgent $terminal) => $terminal
                ->openRuntime(
                    'Box',
                    base_path(),
                    driver: 'claude-code',
                    build: '2.1.323',
                    profile: 'claude',
                    driverType: DriverType::Terminal,
                    model: 'claude-opus-5-5',
                    firstMessage: 'Count slowly from 1 to 300, then say done.',
                )
                ->proveStart(HostProcessPurpose::AgentTerminal, 'terminal'))
            ->hostProcess('terminal', fn (TestHostProcess $terminal) => $terminal->driveUntil($answered, seconds: 20));
        $process = $this->journal->hostProcessCalled('terminal');
        $this->journal
            ->asSystem(new StopHostProcessCommand($process->id, 1000, 1000, HostInstructionSource::fromJournal()));
        $this->journal->hostProcess('terminal', fn (TestHostProcess $terminal) => $terminal
            ->waitFor(HostProcessStatus::Exited));

        $removed = HostInstruction::query()
            ->where('type', HostInstructionType::Remove)
            ->get()
            ->map(fn (HostInstruction $instruction) => $this->journal->payloadOf($instruction)['container'])
            ->all();

        $this->journal->assertJournal(fn (Assert $journal) => $journal->where(
            'testHost.containers',
            fn (array $containers) => $this->isSessionContainer($this->containerCalled($containers, $process->container_name)),
        ));
        $this->journal->assertResult(true, in_array($process->container_name, $removed, true));
    }

    /**
     * The session's container runs the agent image on the installation's network, with the managed settings mounted
     * read-only and no value left for the host to fill.
     *
     * @param  array<string, mixed>  $session
     */
    private function isSessionContainer(array $session): bool
    {
        return $session['image'] === TestHost::IMAGE
            && str_starts_with((string) $session['network'], TestHost::INSTALLATION_NAME.'-')
            && $this->hasMountAt($session, '/etc/claude-code/managed-settings.json')
            && array_filter($session['env'], fn (string $entry) => str_contains($entry, '{host:')) === [];
    }

    /**
     * The shape the mock Docker recorded of the named container.
     *
     * @param  list<array<string, mixed>>  $containers
     * @return array<string, mixed>
     */
    private function containerCalled(array $containers, string $name): array
    {
        $started = array_values(array_filter($containers, fn (array $container) => $container['name'] === $name));

        return $started[0] ?? $this->fail("The mock Docker started no container {$name}.");
    }

    /**
     * @param  array<string, mixed>  $container
     * @return list<array<string, mixed>>
     */
    private function mountsOf(array $container): array
    {
        return $container['mounts'] ?? [];
    }

    /**
     * @param  array<string, mixed>  $container
     */
    private function hasMountAt(array $container, string $target): bool
    {
        foreach ($this->mountsOf($container) as $mount) {
            if ($mount['target'] === $target && $mount['readOnly'] === true) {
                return true;
            }
        }

        return false;
    }
}
