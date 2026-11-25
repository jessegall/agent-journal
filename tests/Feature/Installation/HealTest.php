<?php

declare(strict_types=1);

namespace Tests\Feature\Installation;

use Tests\Support\Installation\StandInInstallation;
use Tests\TestCase;

/**
 * The updater's supervisor (.docker/updater/heal.sh) run for real against the stand-in Docker: a service that stopped
 * or turned unhealthy is started again, a step that failed runs again, a fault that does not heal is tried a bounded
 * number of times and then written for the journal to show, and a healed fault leaves nothing behind.
 */
final class HealTest extends TestCase
{
    private const string GAVE_UP = 'The installation could not bring back agent-images: it ended with exit code 1. It '
        ."stopped trying after 5 tries; the updater's log has each try.";

    private const string WEB = 'web';

    private const string STEP = 'agent-images';

    private const string START_SERVICE = 'up -d --wait --wait-timeout 120 web';

    private const string RUN_STEP = 'up -d --force-recreate --no-deps agent-images';

    private StandInInstallation $installation;

    protected function setUp(): void
    {
        parent::setUp();

        $this->installation = StandInInstallation::contained();
        $this->installation->push(['README.md' => 'first']);
        $this->installation->update();
        $this->installation->docker->forgetCalls();
    }

    protected function tearDown(): void
    {
        $this->installation->remove();

        parent::tearDown();
    }

    public function test_an_installation_that_is_well_is_left_as_it_is(): void
    {
        $heal = $this->installation->heal();

        $this->assertSame(0, $heal->getExitCode(), $heal->getOutput().$heal->getErrorOutput());
        $this->assertFalse($this->installation->docker->wasAsked('up -d'));
        $this->assertSame('', $this->installation->faults());
    }

    public function test_a_service_that_stopped_is_started_again(): void
    {
        $this->installation->containersAre([$this->web('exited', ''), $this->step(0)]);

        $this->installation->heal();

        $this->assertTrue($this->installation->docker->wasAsked(self::START_SERVICE));
        $this->assertSame('', $this->installation->faults());
    }

    public function test_an_unhealthy_service_is_started_again(): void
    {
        $this->installation->containersAre([$this->web('running', 'unhealthy'), $this->step(0)]);

        $this->installation->heal();

        $this->assertTrue($this->installation->docker->wasAsked(self::START_SERVICE));
    }

    public function test_a_step_that_failed_runs_again_in_a_new_container(): void
    {
        $this->installation->containersAre([$this->web('running', 'healthy'), $this->step(1)]);

        $this->installation->heal();

        $this->assertTrue($this->installation->docker->wasAsked(self::RUN_STEP));
        $this->assertTrue($this->installation->docker->wasAsked('wait container-'.self::STEP));
    }

    public function test_a_fault_that_does_not_heal_is_tried_five_times_and_then_shown_with_its_reason(): void
    {
        $this->installation->containersAre([$this->web('running', 'healthy'), $this->step(1)]);
        $this->installation->endStepsWith(1);

        foreach (range(1, 6) as $round) {
            $this->installation->heal();
        }

        $this->assertCount(5, $this->installation->docker->callsHolding(self::RUN_STEP));
        $this->assertSame(
            self::GAVE_UP,
            $this->installation->faults(),
        );
    }

    public function test_a_fault_that_heals_by_itself_is_forgotten_and_no_longer_shown(): void
    {
        $this->installation->containersAre([$this->web('running', 'healthy'), $this->step(1)]);
        $this->installation->endStepsWith(1);

        foreach (range(1, 5) as $round) {
            $this->installation->heal();
        }

        $this->installation->containersAre([$this->web('running', 'healthy'), $this->step(0)]);
        $this->installation->heal();

        $this->assertSame('', $this->installation->faults());
    }

    /**
     * @return array{Service: string, State: string, Health: string, ExitCode: int}
     */
    private function web(string $state, string $health): array
    {
        return ['Service' => self::WEB, 'State' => $state, 'Health' => $health, 'ExitCode' => 0];
    }

    /**
     * @return array{Service: string, State: string, Health: string, ExitCode: int}
     */
    private function step(int $exitCode): array
    {
        return ['Service' => self::STEP, 'State' => 'exited', 'Health' => '', 'ExitCode' => $exitCode];
    }
}
