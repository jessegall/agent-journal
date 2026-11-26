<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\ClaudeCode\ClaudeAccountProtection;
use App\Agents\Drivers\DefaultDrivers;
use App\Enums\Drivers\ExecutablePlace;
use App\Enums\Hosts\HostProcessType;
use App\Enums\Sessions\TransportProfileType;
use App\Support\AccountStartRecipe;
use App\Support\StartSetting;
use App\Values\DriverAccount;
use App\Values\DriverStart;
use App\Values\HostProcessPlan;
use App\Values\JournalServer;
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
                    $starts[$name] = new DriverStart(self::SESSION, $type, '/work', 'Run: ls.', $isResume, account: $account);
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
            'a seatbelted account' => new DriverAccount(
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

        $planned = ['purpose' => $built->purpose->value, ...$built->payload()];

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
