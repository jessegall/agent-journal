<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\Codex\CodexAccountSettings;
use App\Agents\Drivers\Codex\CodexAdapter;
use App\Agents\Drivers\Codex\CodexArguments;
use App\Agents\Drivers\Codex\CodexChangeEffort;
use App\Agents\Drivers\Codex\CodexChangeModel;
use App\Agents\Drivers\Codex\CodexLayout;
use App\Agents\Drivers\Codex\CodexModelAnswer;
use App\Agents\Drivers\Codex\CodexSignInEnvironment;
use App\Agents\Drivers\Codex\CodexSignInReader;
use App\Agents\Drivers\Codex\CodexSkills;
use App\Agents\Drivers\Codex\CodexTurnResults;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\Contracts\PinnedBuilds;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Hooks\HookReplies;
use App\Agents\Drivers\Setup\DefaultDriverSetup;
use App\Agents\Drivers\Setup\DriverImage;
use App\Agents\Drivers\Setup\DriverProfiles;
use App\Agents\Drivers\Setup\DriverSetup;
use App\Agents\Drivers\Setup\HeadlessTurns;
use App\Agents\Drivers\Setup\ModelCheck;
use App\Agents\Drivers\Setup\SignInSetup;
use App\Agents\Drivers\Setup\VersionLine;
use App\Agents\Drivers\Setup\VersionProbe;
use App\Agents\Exceptions\DriverSetupInvalid;
use App\Agents\SignInEgress;
use App\Exceptions\PlanAdditionClash;
use App\Files\Contracts\Files;
use App\Hosts\Protocol\Payloads\HostRestartFilePayload;
use App\Values\PlanAddition;
use Tests\TestCase;

/**
 * The drivers set up match the catalogue, a version line accepts only the pinned build, and a plan holds one restart
 * file.
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
                $exact->accepts("codex-cli 0.172.0\n", '0.172.0'),
                $exact->accepts('codex-cli 0.172.0 beta', '0.172.0'),
                $prefix->accepts('2.1.332 (Claude Code)', '2.1.332'),
                $prefix->accepts('2.1.3320 (Claude Code)', '2.1.332'),
            ],
        );
    }

    public function test_a_plan_takes_one_restart_file(): void
    {
        $restart = new PlanAddition(restartWhenFile: HostRestartFilePayload::from(['folder' => '/home', 'glob' => '*.jsonl']));

        $joined = $restart->with(new PlanAddition(sideSockets: ['status']));

        $this->journal->assertResult(['/home', ['status']], [$joined->restartWhenFile?->folder, $joined->sideSockets]);
        $this->journal->assertRefused(PlanAdditionClash::class, fn () => $restart->with($restart));
    }

    /**
     * @param  list<DriverSetup>  $setups
     */
    public function test_a_declaration_that_misses_a_part_every_driver_needs_is_refused_naming_it(): void
    {
        $naming = fn (string $part) => fn (DriverSetupInvalid $refusal) => $this->assertStringContainsString(
            "declared without its {$part}",
            $refusal->getMessage(),
        );

        $this->journal
            ->assertRefused(DriverSetupInvalid::class, fn () => DefaultDriverSetup::for('lone')->build(), $naming('driver'))
            ->assertRefused(
                DriverSetupInvalid::class,
                fn () => DefaultDriverSetup::for('lone')->driver('lone')->build(),
                $naming('image'),
            );
    }

    /**
     * Codex declared with every part but its journal server and hook relay.
     */
    private function partlyDeclared(): DefaultDriverSetup
    {
        return DefaultDriverSetup::for('example')
            ->driver(CodexArguments::EXECUTABLE)
            ->image(DriverImage::at('.docker/drivers/codex'))
            ->arguments(CodexArguments::class)
            ->version(new VersionProbe(['codex', '--version'], [], VersionLine::exactly('codex-cli {build}')))
            ->signInProbe(['codex', 'login', 'status'], CodexSignInReader::class)
            ->layout(CodexLayout::class)
            ->keyScripts([CodexChangeModel::class, CodexChangeEffort::class])
            ->headlessTurns(HeadlessTurns::eachInAProcess(CodexTurnResults::class))
            ->signIn(new SignInSetup(
                executable: 'codex',
                environment: CodexSignInEnvironment::class,
                modelCheck: new ModelCheck(['exec', 'Reply with OK.'], CodexModelAnswer::class, 1),
                signOut: ['logout'],
                methods: [],
            ))
            ->accountSettings(CodexAccountSettings::class)
            ->skills(CodexSkills::class)
            ->hookAdapter(CodexAdapter::class);
    }

    private function profiles(array $setups): DriverProfiles
    {
        return new DriverProfiles(
            $this->app,
            $this->journal->service(DriverCatalogue::class),
            $this->journal->service(PinnedBuilds::class),
            $this->journal->service(HookReplies::class),
            $this->journal->service(Files::class),
            $this->journal->service(SignInEgress::class),
            $setups,
        );
    }

    /**
     * Codex declared whole, every part it needs given, for a family of the test's own.
     */
    private function codex(string $family): DriverSetup
    {
        return $this->partlyDeclared()->build()->forFamily($family);
    }
}
