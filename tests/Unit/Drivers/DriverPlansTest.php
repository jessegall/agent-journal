<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Accounts\AccountStartRecipe;
use App\Accounts\StartSetting;
use App\Agents\ContainerManifest;
use App\Agents\Drivers\ClaudeCode\ClaudeAccountProtection;
use App\Agents\Drivers\ClaudeCode\ClaudeCodeArguments;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\ExecutablePlace;
use App\Agents\Enums\WorkspaceUse;
use App\Agents\Exceptions\ProfileRefused;
use App\Agents\SecurityOptions;
use App\Agents\Values\JournalServer;
use App\Agents\Values\PlanFile;
use App\Hosts\Exceptions\ProgramLineRefused;
use App\Hosts\ProgramLines;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostProcessType;
use App\Hosts\Protocol\Payloads\HostContainerLabelsPayload;
use App\Sessions\Enums\TransportProfileType;
use App\Sessions\Values\SessionContainer;
use App\Support\MountRules;
use App\Values\DriverAccount;
use App\Values\DriverStart;
use App\Values\ExecutionBudgets;
use App\Values\HostProcessPlan;
use Closure;
use Tests\TestCase;
use Throwable;

/**
 * Every start plan and probe both drivers build, over a matrix of starts, is the one recorded in the fixture: a change
 * to how a driver is set up keeps each plan, flag and variable as it was.
 */
final class DriverPlansTest extends TestCase
{
    private const string FIXTURE = __DIR__.'/../../Fixtures/Drivers/plans.json';

    private const string MODEL = 'sonnet';

    private const string EFFORT = 'medium';

    private const string SESSION = '3d9b1c22-7e40-4a51-9f63-5b8e2a1c0d77';

    public function test_every_plan_and_probe_of_both_drivers_is_the_recorded_one(): void
    {
        $plans = [];
        $this->journal->fixRandomStrings('the-seal-key');

        foreach ([
            DefaultDrivers::CLAUDE_CODE,
            DefaultDrivers::CODEX,
        ] as $family) {
            $profile = $this->journal->driverProfile($family);
            $plans["{$family} version probe"] = $this->planned(fn () => $profile->versionProbe('/work', ExecutablePlace::Host));

            foreach ($this->starts($family) as $name => $start) {
                $plans["{$family} {$name} start"] = $this->planned(fn () => $profile->startPlan($start));
                $plans["{$family} {$name} sign-in probe"] = $this->planned(fn () => $profile->signInProbe($start));
            }
        }

        $this->journal->assertResult($this->recorded($plans), $plans);
    }

    public function test_every_recorded_line_of_both_drivers_is_one_host_protocol_1_declares(): void
    {
        $lines = $this->journal->service(ProgramLines::class);
        $recorded = json_decode((string) file_get_contents(self::FIXTURE), true, flags: JSON_THROW_ON_ERROR);
        $built = array_filter($recorded, fn (array $plan) => array_key_exists('argv', $plan));

        foreach ($built as $plan) {
            $lines->assertDeclared($plan['argv']);
        }

        $this->journal->assertRefused(
            ProgramLineRefused::class,
            fn () => $lines->assertDeclared(['claude', '--dangerously-skip-permissions', '--session-id', 's-1']),
            fn (ProgramLineRefused $refusal) => $this->journal->assertResult(
                'The claude-code line names --dangerously-skip-permissions, which host protocol 1 does not declare for it.',
                $refusal->getMessage(),
            ),
        );
    }

    public function test_every_start_of_both_drivers_names_its_model_and_effort_and_one_without_them_is_refused(): void
    {
        $named = [];

        foreach ([HostProcessType::Terminal, HostProcessType::Pipe] as $type) {
            $start = new DriverStart(self::SESSION, $type, '/work', 'Run: ls.', model: 'chosen-model', effort: 'high');
            $claude = $this->journal->driverProfile(DefaultDrivers::CLAUDE_CODE)->startPlan($start);
            $codex = $this->journal->driverProfile(DefaultDrivers::CODEX)->startPlan($start);
            $claudeSettings = array_values(array_filter(
                $claude->files,
                fn (PlanFile $file) => str_ends_with($file->name, 'settings.json'),
            ))[0]->content;
            $named[] = [
                in_array('chosen-model', $claude->argv, true),
                json_decode($claudeSettings, true)['effortLevel'] ?? null,
                in_array('chosen-model', $codex->argv, true),
                in_array('model_reasoning_effort=high', $codex->argv, true),
            ];
        }

        $this->journal->assertResult([[true, 'high', true, true], [true, 'high', true, true]], $named);
        $this->journal->assertRefused(
            ProfileRefused::class,
            fn () => $this->journal->driverProfile(DefaultDrivers::CODEX)->startPlan(
                new DriverStart(self::SESSION, HostProcessType::Terminal, '/work', model: 'chosen-model'),
            ),
        );
    }

    public function test_a_start_handed_skills_writes_them_and_claude_code_loads_their_folder(): void
    {
        $skill = new PlanFile('journal-skills/skills/review/SKILL.md', 'Read the diff.');
        $codexSkill = new PlanFile('skills/review/SKILL.md', 'Read the diff.');
        $planOf = fn (string $family, PlanFile $file) => $this->journal->driverProfile($family)->startPlan(
            new DriverStart(
                self::SESSION,
                HostProcessType::Terminal,
                '/work',
                skillFiles: [$file],
                model: self::MODEL,
                effort: self::EFFORT,
            ),
        );
        $claude = $planOf(DefaultDrivers::CLAUDE_CODE, $skill);
        $codex = $planOf(DefaultDrivers::CODEX, $codexSkill);

        $this->journal->assertResult(
            [true, true, true, false],
            [
                in_array($skill, $claude->files, false),
                in_array($codexSkill, $codex->files, false),
                in_array(ClaudeCodeArguments::SKILLS, $claude->argv, true),
                in_array('--plugin-dir', $codex->argv, true),
            ],
        );
    }

    public function test_a_contained_start_opens_in_its_container_with_nothing_of_the_host(): void
    {
        $manifest = ContainerManifest::probe('registry.example/agent@sha256:'.str_repeat('a', 64), SecurityOptions::none());
        $labels = HostContainerLabelsPayload::from(['installation' => 'acme', 'session' => 's1', 'account' => '01a1']);
        $server = new JournalServer('/opt/journal/bin/journal-mcp');
        $account = new DriverAccount($this->recipe(DefaultDrivers::CLAUDE_CODE, TransportProfileType::Mcp), 'start-1', $server);
        $start = new DriverStart(
            self::SESSION,
            HostProcessType::Terminal,
            '/workspace',
            hookCommand: '/opt/journal/bin/journal-hook',
            account: $account,
            executablePlace: ExecutablePlace::Image,
            container: new SessionContainer($manifest, $labels),
            model: self::MODEL,
            effort: self::EFFORT,
        );

        $plan = $this->journal->driverProfile(DefaultDrivers::CLAUDE_CODE)->startPlan($start);
        $payload = json_decode((string) json_encode($plan->payload()), true);

        $this->journal->assertResult(
            [HostInstructionType::OpenContainer, ['installation' => 'acme', 'session' => 's1', 'account' => '01a1'], [], true, []],
            [
                $plan->instructionType(),
                $payload['labels'],
                $plan->inherit,
                in_array(MountRules::MANAGED_SETTINGS_FILE, array_map(fn (PlanFile $file) => $file->name, $plan->files), true),
                array_values(array_filter(
                    [...$plan->argv, ...$plan->environment, ...array_map(fn (PlanFile $file) => $file->content, $plan->files)],
                    fn (string $text) => str_contains($text, '{host:') || str_contains($text, 'sockets'),
                )),
            ],
        );
    }

    public function test_a_contained_codex_start_reads_its_sign_in_from_the_mounted_account_as_claude_code_does(): void
    {
        $manifest = ContainerManifest::probe('registry.example/agent@sha256:'.str_repeat('a', 64), SecurityOptions::none());
        $labels = HostContainerLabelsPayload::from(['installation' => 'acme', 'session' => 's1', 'account' => '01a1']);
        $recipe = new AccountStartRecipe(
            environment: [new StartSetting('CODEX_HOME', MountRules::ACCOUNT_TARGET)],
            emptyFolderVariables: [],
            removedVariables: [],
            startFlags: [],
            accountSettings: [],
            driverVersion: $this->journal->driverProfile(DefaultDrivers::CODEX)->build(),
            binaryDigest: '',
            arrangement: 'contained',
            protectionSettings: '',
            transportProfile: TransportProfileType::Mcp,
            readFiles: [],
        );
        $start = new DriverStart(
            self::SESSION,
            HostProcessType::Terminal,
            '/workspace',
            hookCommand: '/opt/journal/bin/journal-hook',
            account: new DriverAccount($recipe, 'start-1', new JournalServer('/opt/journal/bin/journal-mcp')),
            executablePlace: ExecutablePlace::Image,
            container: new SessionContainer($manifest, $labels),
            model: self::MODEL,
            effort: self::EFFORT,
        );

        $plan = $this->journal->driverProfile(DefaultDrivers::CODEX)->startPlan($start);

        $this->journal->assertResult(
            [HostInstructionType::OpenContainer, true, true, []],
            [
                $plan->instructionType(),
                in_array('CODEX_HOME='.MountRules::ACCOUNT_TARGET, $plan->environment, true),
                in_array('HOME=/home/journal', $plan->environment, true),
                array_values(array_filter(
                    [...$plan->argv, ...$plan->environment],
                    fn (string $text) => str_contains($text, '{host:') || str_contains($text, '{folder:'),
                )),
            ],
        );
    }

    public function test_the_sign_in_probe_of_a_contained_terminal_start_runs_on_pipes_without_its_terminal(): void
    {
        $image = 'registry.example/agent@sha256:'.str_repeat('a', 64);
        $budgets = ExecutionBudgets::defaults();
        $manifest = ContainerManifest::make(
            $image,
            '10001:10001',
            true,
            [],
            false,
            'journal-net-s1',
            [MountRules::local()->workspaceMount('/srv/work', WorkspaceUse::Shared)],
            [],
            $budgets,
            MountRules::local(),
            SecurityOptions::none(),
            true,
        );
        $server = new JournalServer('/opt/journal/bin/journal-mcp');
        $account = new DriverAccount($this->recipe(DefaultDrivers::CLAUDE_CODE, TransportProfileType::Mcp), 'start-1', $server);
        $start = new DriverStart(
            self::SESSION,
            HostProcessType::Terminal,
            '/workspace',
            hookCommand: '/opt/journal/bin/journal-hook',
            account: $account,
            executablePlace: ExecutablePlace::Image,
            container: new SessionContainer(
                $manifest,
                HostContainerLabelsPayload::from(['installation' => 'acme', 'session' => 's1', 'account' => '01a1']),
            ),
            model: self::MODEL,
            effort: self::EFFORT,
        );
        $profile = $this->journal->driverProfile(DefaultDrivers::CLAUDE_CODE);

        $this->journal->assertResult(
            [true, false],
            [
                $profile->startPlan($start)->container?->isAttachable,
                $profile->signInProbe($start)->container?->isAttachable,
            ],
        );
    }

    /**
     * @return array<string, DriverStart>
     */
    private function starts(string $family): array
    {
        $starts = [];

        foreach ($this->accounts($family) as $accountName => $account) {
            foreach ([
                HostProcessType::Terminal,
                HostProcessType::Pipe,
            ] as $type) {
                foreach ([
                    false,
                    true,
                ] as $isResume) {
                    $name = "{$type->value} on {$accountName}".($isResume ? ' resumed' : '');
                    $starts[$name] = new DriverStart(
                        self::SESSION,
                        $type,
                        '/work',
                        'Run: ls.',
                        $isResume,
                        account: $account,
                        model: self::MODEL,
                        effort: self::EFFORT,
                    );
                    $starts["{$name} with everything"] = new DriverStart(
                        self::SESSION,
                        $type,
                        '/work',
                        'Run: ls.',
                        $isResume,
                        'the-model',
                        'high',
                        '/opt/journal/bin/journal-hook',
                        $account,
                    );
                }
            }
        }

        return $starts;
    }

    /**
     * @return array<string, DriverAccount|null>
     */
    private function accounts(string $family): array
    {
        $server = new JournalServer('{host:INSTALLATION}/bin/php', '{host:INSTALLATION}/bin/journal-mcp');

        return [
            'no account' => null,
            'an MCP account' => new DriverAccount($this->recipe($family, TransportProfileType::Mcp), 'start-1', $server),
            'a CLI account' => new DriverAccount($this->recipe($family, TransportProfileType::Cli), 'start-1', $server),
            'a protected account' => new DriverAccount(
                $this->recipe($family, TransportProfileType::Mcp),
                'start-1',
                $server,
                isProtected: true,
                folder: '/accounts/a',
            ),
            'a host account with a folder' => new DriverAccount(
                $this->recipe($family, TransportProfileType::Mcp),
                'start-1',
                $server,
                folder: '/accounts/a',
            ),
        ];
    }

    private function recipe(string $family, TransportProfileType $transport): AccountStartRecipe
    {
        $home = $family === DefaultDrivers::CODEX ? 'CODEX_HOME' : 'CLAUDE_CONFIG_DIR';

        return new AccountStartRecipe(
            environment: [new StartSetting($home, '/accounts/a'), new StartSetting('ANTHROPIC_API_KEY', 'leaked')],
            emptyFolderVariables: [],
            removedVariables: ['ANTHROPIC_API_KEY'],
            startFlags: [],
            accountSettings: [],
            driverVersion: $this->journal->driverProfile($family)->build(),
            binaryDigest: '',
            arrangement: 'local',
            protectionSettings: $family === DefaultDrivers::CODEX
                ? ''
                : ClaudeAccountProtection::settingsFor('/accounts/a', '/accounts'),
            transportProfile: $transport,
            readFiles: [],
        );
    }

    /**
     * The plan's purpose and payload as JSON reads it back, or the refusal it ended in, as the fixture keeps it.
     *
     * @param  Closure(): HostProcessPlan  $plan
     * @return array<string, mixed>
     */
    private function planned(Closure $plan): array
    {
        try {
            $built = $plan();
        } catch (Throwable $refusal) {
            return [
                'refused' => $refusal::class,
                'message' => $refusal->getMessage(),
            ];
        }

        $planned = ['purpose' => $built->purpose->value, ...$built->payload()->toArray()];

        return json_decode(json_encode($planned, JSON_THROW_ON_ERROR), true, flags: JSON_THROW_ON_ERROR);
    }

    /**
     * The recorded plans; the first run records today's plans and stops, so every later run compares against them.
     *
     * @param  array<string, array<string, mixed>>  $plans
     * @return array<string, array<string, mixed>>
     */
    private function recorded(array $plans): array
    {
        if (! is_file(self::FIXTURE)) {
            file_put_contents(self::FIXTURE, json_encode($plans, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)."\n");
            $this->markTestIncomplete('Recorded today\'s plans; run the test again to compare against them.');
        }

        return json_decode((string) file_get_contents(self::FIXTURE), true, flags: JSON_THROW_ON_ERROR);
    }
}
