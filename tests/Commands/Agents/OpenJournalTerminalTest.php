<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\CheckSignIn\CheckSignInCommand;
use App\Agents\Commands\OpenJournalTerminal\OpenJournalTerminalCommand;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Drivers\Work\HeadlessStarts;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\RestartPolicy;
use App\Hosts\Protocol\ContainedPlanFields;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;
use App\Models\Sessions\SessionProcess;
use App\Sessions\OpenedRuntime;
use App\Terminals\RuntimeScreen;
use App\Terminals\ScreenRegistration;
use Tests\Support\Agents\TestAgent;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestHost;
use Tests\Support\Hosts\TestHostProcess;
use Tests\TestCase;

/**
 * A Claude Code terminal start is claimed and probed by the journal, and once its sign-in is proven the journal opens
 * its terminal, healed on a crash, for its driver worker to type into; a second open makes nothing.
 */
#[TestsCommand(OpenJournalTerminalCommand::class)]
final class OpenJournalTerminalTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'hosts', 'host_processes', 'host_instructions', 'agents', 'agent_sessions', 'session_tokens', 'agent_stacks',
        'hook_calls', 'agent_runtimes', 'driver_requests', 'driver_turns', 'accounts', 'active_accounts',
        'session_processes', 'session_requests', 'inboxes', 'inbox_members', 'links', 'users',
    ];

    public function test_a_proven_claude_terminal_start_opens_its_terminal_once(): void
    {
        [$opened, $start] = $this->provenTerminal();

        $terminal = HostProcess::query()
            ->where('session_process_id', $start->id)
            ->where('purpose', HostProcessPurpose::AgentTerminal)
            ->sole();
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->nameProcess('terminal', HostProcessPurpose::AgentTerminal));
        [$open] = $this->journal->hostInstructionsOf('terminal');
        $this->journal->assertResult(
            [RestartPolicy::OnCrash->value, null],
            [
                $this->journal->payloadOf($open)['restart'],
                $this->journal->asSystem(new OpenJournalTerminalCommand($opened->runtimeId)),
            ],
        );
        $this->journal->assertResult($terminal->id, $this->journal->hostProcessCalled('terminal')->id);
    }

    public function test_what_the_terminal_shows_reaches_the_terminal_page(): void
    {
        [$opened] = $this->provenTerminal();
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->nameProcess('terminal', HostProcessPurpose::AgentTerminal));

        $this->journal->hostProcess('terminal', fn (TestHostProcess $terminal) => $terminal->print('❯ ready'));

        $runtime = AgentRuntime::query()->whereKey($opened->runtimeId)->sole();
        $screen = $this->journal->service(RuntimeScreen::class)->latest(ScreenRegistration::of($runtime));
        $this->journal->assertResult('❯ ready', $screen?->frame->rows[0]->runs[0]->text);
    }

    public function test_a_contained_terminal_names_nothing_of_the_host_and_reaches_the_journal_at_the_session_address(): void
    {
        $this->journal
            ->owner()
            ->chooseActiveAccounts()
            ->showDriverArrangements()
            ->arrangeContainedJournal()
            ->idleAgent('Driven')
            ->enrollContainedHost('Box', [base_path()])
            ->readyDriverImagesOn('Box');
        $this->proveTerminalOn('Box');
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->nameProcess('terminal', HostProcessPurpose::AgentTerminal));

        [$open] = $this->journal->hostInstructionsOf('terminal');
        $plan = $this->journal->payloadOf($open);
        $refusedFieldsSet = array_filter(array_intersect_key($plan, array_flip(ContainedPlanFields::REFUSED)));
        $this->journal->assertResult([[], false], [$refusedFieldsSet, str_contains((string) json_encode($plan), '{host:')]);
        $this->journal->assertResult(
            ['JOURNAL_URL='.TestHost::SESSION_JOURNAL_URL],
            array_values(array_filter(
                $this->journal->payloadOf($open)['environment'],
                fn (string $variable) => str_starts_with($variable, 'JOURNAL_URL='),
            )),
        );
    }

    public function test_a_contained_terminal_is_handed_no_managed_policy_and_runs_its_hooks_with_their_reply_file(): void
    {
        $this->journal
            ->owner()
            ->chooseActiveAccounts()
            ->showDriverArrangements()
            ->arrangeContainedJournal()
            ->idleAgent('Driven')
            ->enrollContainedHost('Box', [base_path()])
            ->readyDriverImagesOn('Box');
        $this->proveTerminalOn('Box');
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->nameProcess('terminal', HostProcessPurpose::AgentTerminal));

        [$open] = $this->journal->hostInstructionsOf('terminal');
        $files = $this->archivedFiles($this->journal->payloadOf($open)['container']['preparations']);
        $settings = json_decode($files['settings.json'], true, flags: JSON_THROW_ON_ERROR);

        // The Claude Code driver image holds the managed policy, so a start is handed none.
        $this->journal->assertResult(
            [false, '/opt/journal/bin/journal-hook claude-code /tmp/journal-session/hook-replies.json'],
            [
                array_key_exists('managed-settings.json', $files),
                $settings['hooks']['SessionStart'][0]['hooks'][0]['command'],
            ],
        );
    }

    /**
     * A Claude Code terminal start on a host that runs agents itself, whose build and sign-in probes passed.
     *
     * @return array{OpenedRuntime, SessionProcess}
     */
    private function provenTerminal(): array
    {
        $this->journal
            ->owner()
            ->chooseActiveAccounts()
            ->showDriverArrangements()
            ->idleAgent('Driven')
            ->enrollHost('Mac', [base_path()]);

        return $this->proveTerminalOn('Mac');
    }

    /**
     * Opens the agent's terminal start on the host named and passes its build and sign-in probes.
     *
     * @return array{OpenedRuntime, SessionProcess}
     */
    private function proveTerminalOn(string $hostName): array
    {
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->openRuntime($hostName, base_path(), driverType: DriverType::Terminal));
        $opened = $this->journal->openedRuntimeOf('Driven');
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven->passBuildProbe('Driven'));
        $start = $this->journal->startOfSession($opened->sessionId);
        $runtime = AgentRuntime::query()->whereKey($opened->runtimeId)->sole();
        $folder = $this->journal->service(HeadlessStarts::class)->accountFolderSeenBy($runtime, $start);
        $signedIn = ['loggedIn' => true, 'authMethod' => 'claude.ai', 'configDirectory' => $folder];

        $this->journal->asSystem(new CheckSignInCommand(
            $this->journal->hostProcessCalled('Driven-sign-in')->id,
            (string) json_encode($signedIn),
        ));

        return [$opened, $start];
    }

    /**
     * The plan files a contained start's preparations hand its files folder, by name, read from their tar archive.
     *
     * @param  list<array<string, mixed>>  $preparations
     * @return array<string, string>
     */
    private function archivedFiles(array $preparations): array
    {
        $files = [];

        foreach ($preparations as $preparation) {
            $archive = (string) base64_decode((string) ($preparation['input'] ?? ''), true);

            for ($offset = 0; $offset + 512 <= strlen($archive);) {
                $name = rtrim(substr($archive, $offset, 100), "\0");
                $size = (int) octdec(rtrim(substr($archive, $offset + 124, 12), "\0 "));

                if ($name === '') {
                    break;
                }
                $files[$name] = substr($archive, $offset + 512, $size);
                $offset += 512 + (int) ceil($size / 512) * 512;
            }
        }

        return $files;
    }
}
