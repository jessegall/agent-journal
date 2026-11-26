<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\Codex\CodexAccountSettings;
use App\Agents\Drivers\Codex\CodexAdapter;
use App\Agents\Drivers\Codex\CodexArguments;
use App\Agents\Drivers\Codex\CodexKeyScripts;
use App\Agents\Drivers\Codex\CodexLayout;
use App\Agents\Drivers\Codex\CodexModelAnswer;
use App\Agents\Drivers\Codex\CodexSignInEnvironment;
use App\Agents\Drivers\Codex\CodexSignInReader;
use App\Agents\Drivers\Codex\CodexSkills;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Setup\DriverProfiles;
use App\Agents\Drivers\Setup\DriverSetup;
use App\Agents\Drivers\Setup\HeadlessTurns;
use App\Agents\Drivers\Setup\ModelCheck;
use App\Agents\Drivers\Setup\SignInSetup;
use App\Agents\Drivers\Setup\VersionLine;
use App\Agents\Drivers\Setup\VersionProbe;
use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Drivers\PinnedBuilds;
use App\Exceptions\DriverSetupInvalid;
use App\Exceptions\PlanAdditionClash;
use App\Values\PlanAddition;
use App\Values\RestartFile;
use Tests\TestCase;

/**
 * The drivers set up match the catalogue, a version line accepts only the pinned build, and a plan holds one Seatbelt
 * profile and one restart file.
 */
final class DriverSetupTest extends TestCase
{
    public function test_a_family_set_up_twice_or_not_at_all_is_refused(): void
    {
        $twice = fn () => $this->profiles([$this->codex(DefaultDrivers::CODEX), $this->codex(DefaultDrivers::CODEX)]);
        $missing = fn () => $this->profiles([$this->codex(DefaultDrivers::CODEX)]);

        $this->journal->assertRefused(DriverSetupInvalid::class, $twice);
        $this->journal->assertRefused(DriverSetupInvalid::class, $missing);
    }

    public function test_a_version_line_accepts_only_the_pinned_build(): void
    {
        $exact = VersionLine::exactly('codex-cli {build}');
        $prefix = VersionLine::startingWith('{build} ');

        $this->journal->assertResult(
            [true, false, true, false],
            [
                $exact->accepts("codex-cli 0.165.0\n", '0.165.0'),
                $exact->accepts('codex-cli 0.165.0 beta', '0.165.0'),
                $prefix->accepts('2.1.323 (Claude Code)', '2.1.323'),
                $prefix->accepts('2.1.3230 (Claude Code)', '2.1.323'),
            ],
        );
    }

    public function test_a_plan_takes_one_seatbelt_and_one_restart_file(): void
    {
        $seatbelt = new PlanAddition(seatbelt: 'session.sb');
        $restart = new PlanAddition(restartWhenFile: new RestartFile('/home', '*.jsonl'));

        $joined = $seatbelt->with($restart)->with(new PlanAddition(sideSockets: ['status']));

        $this->journal->assertResult(['session.sb', ['status']], [$joined->seatbelt, $joined->sideSockets]);
        $this->journal->assertRefused(PlanAdditionClash::class, fn () => $seatbelt->with($seatbelt));
        $this->journal->assertRefused(PlanAdditionClash::class, fn () => $restart->with($restart));
    }

    /**
     * @param  list<DriverSetup>  $setups
     */
    private function profiles(array $setups): DriverProfiles
    {
        return new DriverProfiles(
            $this->app,
            $this->journal->service(DriverCatalogue::class),
            $this->journal->service(PinnedBuilds::class),
            $setups,
        );
    }

    private function codex(string $family): DriverSetup
    {
        return DriverSetup::of(
            family: $family,
            driver: CodexArguments::EXECUTABLE,
            arguments: CodexArguments::class,
            versionProbe: new VersionProbe(['codex', '--version'], [], VersionLine::exactly('codex-cli {build}')),
            signInProbe: ['codex', 'login', 'status'],
            signInReader: CodexSignInReader::class,
            layout: CodexLayout::class,
            keyScripts: CodexKeyScripts::class,
            headlessTurns: HeadlessTurns::onAccountOwner(['codex', 'app-server']),
            signIn: new SignInSetup(
                executableSetting: 'accounts.codex_program',
                environment: CodexSignInEnvironment::class,
                modelCheck: new ModelCheck(['exec', 'Reply with OK.'], CodexModelAnswer::class, 1),
                signOut: ['logout'],
                methods: [],
            ),
            accountSettings: CodexAccountSettings::class,
            skills: CodexSkills::class,
            hookAdapter: CodexAdapter::class,
        );
    }
}
