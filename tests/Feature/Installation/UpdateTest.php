<?php

declare(strict_types=1);

namespace Tests\Feature\Installation;

use Tests\Support\Installation\StandInInstallation;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The update script an installation runs on every push, run for real against a stand-in Docker (rule 76): what it
 * builds, pins and records for a push, and what it leaves alone when a step fails.
 */
#[TimeLimit(seconds: 30, reason: 'Each test runs the real update script, which starts a few hundred small programs.')]
final class UpdateTest extends TestCase
{
    private const string AGENT = 'agent';

    private const string RUNNER = 'runner';

    private const string AGENT_PIN = 'AGENT_IMAGE';

    private const string RUNNER_PIN = 'RUNNER_IMAGE';

    private const string RELEASE = 'JOURNAL_RELEASE';

    private const string MIGRATE = 'migrate';

    private const string SANDBOX_TOOL_CHECK = '--entrypoint socat';

    private const string RUN_IN_IMAGE_CALL = '--entrypoint';

    private const string SAVE_CALL = 'save -o';

    private const string UPDATER_PROFILE = '--profile updater';

    private const string BUILD = 'build updater';

    private const string HOST = 'AGENTS_HOST_ID';

    private const string REBUILD = 'migrate:fresh';

    private const string ENROLL = 'agents:host-enroll';

    private const string RESTART = ' restart ';

    private const string MOUNTING_SERVICE = 'web';

    private StandInInstallation $installation;

    protected function setUp(): void
    {
        parent::setUp();

        $this->installation = StandInInstallation::contained();
    }

    protected function tearDown(): void
    {
        $this->installation->remove();

        parent::tearDown();
    }

    public function test_a_first_install_builds_and_pins_both_images_and_records_the_commit(): void
    {
        $earlierAgent = $this->installation->setting(self::AGENT_PIN);
        $earlierRunner = $this->installation->setting(self::RUNNER_PIN);
        $pushed = $this->installation->push(['README.md' => 'first']);

        $update = $this->installation->update();

        $this->assertSame(0, $update->getExitCode(), $update->getOutput().$update->getErrorOutput());
        $this->assertSame($pushed, $this->installation->installedCommit());
        $this->assertTrue($this->installation->hasBuilt(self::AGENT));
        $this->assertTrue($this->installation->hasBuilt(self::RUNNER));
        $this->assertNotSame($earlierAgent, $this->installation->setting(self::AGENT_PIN));
        $this->assertNotSame($earlierRunner, $this->installation->setting(self::RUNNER_PIN));
        $this->assertNotSame(
            $this->installation->setting(self::AGENT_PIN),
            $this->installation->setting(self::RUNNER_PIN),
        );
        $this->assertSame(substr($pushed, 0, 12), $this->installation->setting(self::RELEASE));
    }

    public function test_the_images_built_here_stay_in_the_record_a_later_commit_replaces(): void
    {
        $this->installation->update();
        $afterFirst = $this->installation->recordedImages();
        $this->installation->push(['app/Models/Task.php' => '<?php']);

        $this->installation->update();

        $this->assertSame(2, $afterFirst);
        $this->assertSame(3, $this->installation->recordedImages());
    }

    public function test_a_push_that_changes_the_agents_sources_builds_and_pins_a_new_agent_image(): void
    {
        $this->installation->update();
        $pinned = $this->installation->setting(self::AGENT_PIN);
        $this->installation->forgetCalls();
        $pushed = $this->installation->push(['tools/journal-agent/relay.go' => 'package relay']);

        $update = $this->installation->update();

        $this->assertSame(0, $update->getExitCode(), $update->getOutput().$update->getErrorOutput());
        $this->assertSame($pushed, $this->installation->installedCommit());
        $this->assertTrue($this->installation->hasBuilt(self::AGENT));
        $this->assertNotSame($pinned, $this->installation->setting(self::AGENT_PIN));
    }

    /**
     * Rule 82: a change to the agent's sources that leaves its image the same, such as a test file, costs a cached
     * build and nothing more: no check runs in the image and no archive is written.
     */
    public function test_an_agent_image_that_comes_out_the_same_is_not_checked_or_archived_again(): void
    {
        $this->installation->update();
        $pinned = $this->installation->setting(self::AGENT_PIN);
        $recorded = $this->installation->recordedImages();
        $this->installation->forgetCalls();
        $this->installation->buildFromCache();
        $pushed = $this->installation->push(['tools/journal-agent/relay_test.go' => 'package relay']);

        $update = $this->installation->update();

        $this->assertSame(0, $update->getExitCode(), $update->getOutput().$update->getErrorOutput());
        $this->assertSame($pushed, $this->installation->installedCommit());
        $this->assertTrue($this->installation->hasBuilt(self::AGENT));
        $this->assertFalse($this->installation->wasAsked(self::SAVE_CALL));
        $this->assertFalse($this->installation->wasAsked(self::RUN_IN_IMAGE_CALL));
        $this->assertSame($pinned, $this->installation->setting(self::AGENT_PIN));
        $this->assertSame($recorded, $this->installation->recordedImages());
    }

    public function test_a_push_that_changes_nothing_of_the_agent_keeps_its_image(): void
    {
        $this->installation->update();
        $pinned = $this->installation->setting(self::AGENT_PIN);
        $this->installation->forgetCalls();
        $pushed = $this->installation->push(['app/Models/Task.php' => '<?php']);

        $update = $this->installation->update();

        $this->assertSame(0, $update->getExitCode(), $update->getOutput().$update->getErrorOutput());
        $this->assertSame($pushed, $this->installation->installedCommit());
        $this->assertFalse($this->installation->hasBuilt(self::AGENT));
        $this->assertTrue($this->installation->hasBuilt(self::RUNNER));
        $this->assertSame($pinned, $this->installation->setting(self::AGENT_PIN));
    }

    public function test_an_agent_image_that_fails_to_build_keeps_its_pin_and_records_the_failed_commit(): void
    {
        $this->installation->update();
        $installed = $this->installation->installedCommit();
        $pinned = $this->installation->setting(self::AGENT_PIN);
        $pushed = $this->installation->push(['tools/journal-agent/relay.go' => 'package relay']);
        $this->installation->failCallsHolding('--file .docker/helper/Dockerfile');

        $update = $this->installation->update();

        $this->assertNotSame(0, $update->getExitCode());
        $this->assertSame($pushed, $this->installation->failedCommit());
        $this->assertSame($installed, $this->installation->installedCommit());
        $this->assertSame($pinned, $this->installation->setting(self::AGENT_PIN));
    }

    public function test_an_agent_image_that_fails_one_of_its_checks_is_not_pinned_or_recorded(): void
    {
        $this->installation->update();
        $pinned = $this->installation->setting(self::AGENT_PIN);
        $recorded = $this->installation->recordedImages();
        $this->installation->push(['tools/journal-agent/relay.go' => 'package relay']);
        $this->installation->failCallsHolding(self::SANDBOX_TOOL_CHECK);

        $update = $this->installation->update();

        $this->assertNotSame(0, $update->getExitCode());
        $this->assertSame($pinned, $this->installation->setting(self::AGENT_PIN));
        $this->assertSame($recorded + 1, $this->installation->recordedImages());
    }

    public function test_a_migration_that_fails_keeps_the_installed_commit_and_records_the_failed_one(): void
    {
        $this->installation->update();
        $installed = $this->installation->installedCommit();
        $pushed = $this->installation->push(['database/migrations/2026_01_01_000000_create_notes_table.php' => '<?php']);
        $this->installation->failCallsHolding(self::MIGRATE);

        $update = $this->installation->update();

        $this->assertNotSame(0, $update->getExitCode());
        $this->assertSame($pushed, $this->installation->failedCommit());
        $this->assertSame($installed, $this->installation->installedCommit());
    }

    public function test_a_push_without_a_migration_runs_none(): void
    {
        $this->installation->update();
        $this->installation->forgetCalls();
        $this->installation->push(['app/Models/Task.php' => '<?php']);

        $this->installation->update();

        $this->assertFalse($this->installation->wasAsked(self::MIGRATE));
    }

    public function test_the_updater_replaces_itself_only_when_its_loop_changed(): void
    {
        $this->installation->update();
        $replacedBefore = $this->installation->wasAsked(self::UPDATER_PROFILE, self::BUILD);
        $this->installation->push(['.docker/updater/loop.sh' => '#!/bin/sh']);

        $this->installation->update();

        $this->assertFalse($replacedBefore);
        $this->assertTrue($this->installation->wasAsked(self::UPDATER_PROFILE, self::BUILD));
    }

    public function test_a_changed_migration_rebuilds_the_database_and_enrolls_the_contained_host_again(): void
    {
        $migration = 'database/migrations/2026_01_01_000000_create_notes_table.php';
        $this->installation->push([$migration => '<?php']);
        $this->installation->update();
        $earlierHost = $this->installation->setting(self::HOST);
        $this->installation->forgetCalls();
        $pushed = $this->installation->push([$migration => '<?php // changed']);

        $update = $this->installation->update();

        $this->assertSame(0, $update->getExitCode(), $update->getOutput().$update->getErrorOutput());
        $this->assertSame($pushed, $this->installation->installedCommit());
        $this->assertTrue($this->installation->wasAsked(self::REBUILD));
        $this->assertTrue($this->installation->wasAsked(self::ENROLL));
        $this->assertNotSame($earlierHost, $this->installation->setting(self::HOST));
        $this->assertNotSame('', $this->installation->hostSecret());
    }

    public function test_a_service_is_restarted_when_a_file_mounted_into_it_changed(): void
    {
        $this->installation->update();
        $this->installation->forgetCalls();
        $this->installation->push(['.docker/web/Caddyfile' => 'changed']);

        $this->installation->update();
        $restartedForItsFile = $this->installation->wasAsked(self::RESTART, self::MOUNTING_SERVICE);
        $this->installation->forgetCalls();
        $this->installation->push(['app/Models/Task.php' => '<?php']);
        $this->installation->update();

        $this->assertTrue($restartedForItsFile);
        $this->assertFalse($this->installation->wasAsked(self::RESTART));
    }

    public function test_a_round_of_the_loop_fetches_the_update_script_of_the_newest_commit_and_runs_it(): void
    {
        $pushed = $this->installation->push(['README.md' => 'first']);

        $this->installation->runLoopOnce();

        $this->assertTrue($this->installation->wasFetched($pushed));
        $this->assertSame($pushed, $this->installation->installedCommit());
    }
}
