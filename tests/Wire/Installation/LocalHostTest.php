<?php

declare(strict_types=1);

namespace Tests\Wire\Installation;

use Tests\Support\Entries\Attributes\OverTheWire;
use Tests\Support\Installation\MockCheckout;
use Tests\TestCase;

/**
 * scripts/local-host.sh run for real in a checkout whose Docker and Go are mocks: a first run builds both images,
 * writes the contained settings and enrolls the host; a run again builds only the image a change reaches; --fresh
 * starts over; and a database that no longer knows the host enrolls it again.
 */
#[OverTheWire]
final class LocalHostTest extends TestCase
{
    private MockCheckout $checkout;

    protected function setUp(): void
    {
        parent::setUp();

        $this->checkout = MockCheckout::withLocalHostScripts();
    }

    protected function tearDown(): void
    {
        $this->checkout->remove();

        parent::tearDown();
    }

    public function test_a_first_run_builds_both_images_writes_the_contained_settings_and_enrolls_the_host(): void
    {
        $this->setUpLocalHost();

        $this->assertTrue($this->checkout->docker->hasBuilt('agent'));
        $this->assertTrue($this->checkout->docker->hasBuilt('runner'));
        $this->assertSame('contained', $this->checkout->setting('AGENTS_ARRANGEMENT'));
        $this->assertMatchesRegularExpression('/^sha256:[0-9a-f]{64}$/', $this->checkout->setting('AGENT_IMAGE'));
        $this->assertMatchesRegularExpression('/^sha256:[0-9a-f]{64}$/', $this->checkout->setting('RUNNER_IMAGE'));
        $this->assertSame('01mockhost', $this->checkout->setting('AGENTS_HOST_ID'));
        $this->assertSame('mock-secret', $this->checkout->hostSecret());
        $this->assertStringContainsString('./cmd/journal-agent', $this->checkout->goBuilds()[0]);
    }

    public function test_a_run_with_nothing_changed_builds_nothing_and_enrolls_nothing(): void
    {
        $this->setUpLocalHost();

        $this->setUpLocalHost();

        $this->assertFalse($this->checkout->docker->hasBuilt('agent'));
        $this->assertFalse($this->checkout->docker->hasBuilt('runner'));
        $this->assertFalse($this->checkout->docker->wasAsked('agents:host-enroll'));
    }

    public function test_a_change_to_the_agent_image_folder_builds_the_agent_image_again(): void
    {
        $this->setUpLocalHost();
        $this->checkout->write('.docker/helper/Dockerfile', "FROM scratch\n");

        $this->setUpLocalHost();

        $this->assertTrue($this->checkout->docker->hasBuilt('agent'));
    }

    public function test_a_change_to_the_go_programs_builds_the_runner_and_the_agent_image_again(): void
    {
        // The agent image's first stage builds its relays and stop check from the same Go module as the host.
        $this->setUpLocalHost();
        $this->checkout->write('programs/agent/cmd/journal-agent/main.go', "package main\n\nfunc main() {}\n");

        $this->setUpLocalHost();

        $this->assertTrue($this->checkout->docker->hasBuilt('runner'));
        $this->assertTrue($this->checkout->docker->hasBuilt('agent'));
    }

    public function test_fresh_removes_the_containers_and_the_enrolment_first(): void
    {
        $this->setUpLocalHost();

        $this->setUpLocalHost('--fresh');

        $this->assertTrue($this->checkout->docker->wasAsked('compose down --volumes --remove-orphans'));
        $this->assertTrue($this->checkout->docker->wasAsked('artisan db:seed'));
        $this->assertTrue($this->checkout->docker->wasAsked('agents:host-enroll'));
        $this->assertSame('01mockhost', $this->checkout->setting('AGENTS_HOST_ID'));
    }

    public function test_a_database_that_no_longer_knows_the_host_enrolls_it_again(): void
    {
        $this->setUpLocalHost();
        $this->checkout->forgetHosts();

        $this->setUpLocalHost();

        $this->assertTrue($this->checkout->docker->wasAsked('compose rm --stop --force agent-host'));
        $this->assertTrue($this->checkout->docker->wasAsked('agents:host-enroll'));
        $this->assertSame('01mockhost', $this->checkout->setting('AGENTS_HOST_ID'));
    }

    /**
     * Runs the script once, after forgetting the mock's earlier calls, and requires it to succeed.
     */
    private function setUpLocalHost(string ...$options): void
    {
        $this->checkout->docker->forgetCalls();
        $run = $this->checkout->runLocalHost(...$options);

        $this->assertSame(0, $run->getExitCode(), $run->getOutput().$run->getErrorOutput());
    }
}
