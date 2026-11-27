<?php

declare(strict_types=1);

namespace Tests\Support\Assertions\Facts;

use App\Hosts\EnrolledHost;
use App\Hosts\ProcessFeed;
use App\Models\Accounts\Account;
use App\Models\Agents\Agent;
use App\Models\Hosts\HostProcess;
use App\Values\SignInChallenge;
use Tests\Support\Assertions\Contracts\Facts;
use Tests\Support\Hosts\TestHost;

/**
 * The test journal's facts, the root an assertion starts from: its hosts, host processes, agents, accounts and
 * sign-ins, each by the name the test gave it, and the running test host; each is read only when asked.
 */
final readonly class JournalFacts implements Facts
{
    /**
     * @param  array<string, EnrolledHost>  $hosts
     * @param  array<string, string>  $hostProcesses  each process id by its name
     * @param  array<string, Agent>  $agents
     * @param  array<string, string>  $signIns  each attempt id by its name
     * @param  array<string, SignInChallenge>  $challenges  the challenge each sign-in showed, by its name
     */
    public function __construct(
        private array $hosts,
        private array $hostProcesses,
        private array $agents,
        private array $signIns,
        private array $challenges,
        private TestHost|null $testHost,
        private ProcessFeed $feed,
    ) {}

    public function facts(): array
    {
        return [
            'hosts' => fn () => array_map(fn (EnrolledHost $host) => new HostFacts($host), $this->hosts),
            'hostProcesses' => fn () => array_map(
                fn (string $processId) => new HostProcessFacts($processId, $this->feed),
                $this->hostProcesses,
            ),
            'purposes' => fn () => $this->processesByPurpose(),
            'agents' => fn () => array_map(fn (Agent $agent) => new AgentFacts($agent, $this->feed), $this->agents),
            'accounts' => fn () => array_map(
                fn (Account $account) => new AccountFacts($account),
                Account::query()->orderBy('id')->get()->all(),
            ),
            'signIns' => fn () => array_map(
                fn (string $attemptId) => new SignInFacts(
                    $attemptId,
                    $this->challenges[array_search($attemptId, $this->signIns, true)] ?? null,
                ),
                $this->signIns,
            ),
            'testHost' => fn () => $this->testHost === null ? null : new TestHostFacts($this->testHost),
        ];
    }

    /**
     * Every host process of the journal, named by the test or not, listed under its purpose.
     *
     * @return array<string, list<HostProcessFacts>>
     */
    private function processesByPurpose(): array
    {
        $purposes = [];

        foreach (HostProcess::query()->orderBy('id')->get() as $process) {
            $purposes[$process->purpose->value][] = new HostProcessFacts($process->id, $this->feed);
        }

        return $purposes;
    }
}
