<?php

declare(strict_types=1);

namespace Tests\StandIn\Hosts;

use App\Agents\Drivers\Enums\DriverType;
use App\Hosts\Commands\StopHostProcess\StopHostProcessCommand;
use App\Hosts\Enums\HostOrderType;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessStatus;
use App\Models\Hosts\HostOrder;
use App\Values\HostOrderSource;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsAgainstStandIn;
use Tests\Support\Hosts\RealHost;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A Claude Code session on a contained host lives its whole life in its own container of the agent image, against
 * the stand-in Docker: its probes and its terminal open as containers, it answers its first message, and once
 * stopped its container is removed.
 */
#[TestsAgainstStandIn]
#[TimeLimit(seconds: 60, reason: 'It runs the real host, the Docker stand-in and a served journal.')]
final class ContainedSessionLifeTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const array TABLES = [
        'hosts',
        'host_processes',
        'host_orders',
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
        $this->journal->owner()
            ->arrangeContainedJournal()
            ->showDriverArrangements()
            ->idleAgent('Terminal')
            ->enrollContainedHost('Box', [base_path()])
            ->runRealHost('Box')
            ->chooseActiveAccountsOnRealHost();
        $opened = $this->journal->openRuntimeOn(
            'Terminal',
            'Box',
            base_path(),
            driver: 'claude-code',
            build: '2.1.323',
            profile: 'claude',
            driverType: DriverType::Terminal,
            model: 'claude-opus-5-5',
            firstMessage: 'Count slowly from 1 to 300, then say done.',
        );
        $answered = fn () => in_array('done', array_map(trim(...), $this->journal->hostProcessRows('terminal')), true);

        $this->journal->proveStartOnRealHost($opened->runtimeId, HostProcessPurpose::AgentTerminal, 'terminal')
            ->driveHostProcess('terminal', $answered, seconds: 20);
        $process = $this->journal->hostProcessCalled('terminal');
        $this->journal->asSystem(new StopHostProcessCommand($process->id, 1000, 1000, HostOrderSource::fromJournal()));
        $this->journal->waitForHostProcess('terminal', HostProcessStatus::Exited);

        $session = $this->sessionContainerOf($process->containerName());
        $removed = HostOrder::query()
            ->where('type', HostOrderType::Remove)
            ->get()
            ->map(fn (HostOrder $order) => $this->journal->payloadOf($order)['container'])
            ->all();

        $this->journal->assertResult(
            [RealHost::IMAGE, true, true, [], true],
            [
                $session['image'],
                str_starts_with((string) $session['network'], RealHost::INSTALLATION_NAME.'-'),
                $this->hasMountAt($session, '/etc/claude-code/managed-settings.json'),
                array_values(array_filter($session['env'], fn (string $entry) => str_contains($entry, '{host:'))),
                in_array($process->containerName(), $removed, true),
            ],
        );
    }

    /**
     * The shape the stand-in Docker recorded of the named container.
     *
     * @return array<string, mixed>
     */
    private function sessionContainerOf(string $name): array
    {
        $started = array_values(array_filter(
            $this->journal->realHostContainers(),
            fn (array $container) => $container['name'] === $name,
        ));

        return $started[0] ?? $this->fail("The stand-in Docker started no container {$name}.");
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
