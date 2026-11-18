<?php

declare(strict_types=1);

namespace Tests\Unit\Engine;

use App\Agents\Support\StackTarget;
use App\Engine\Exceptions\EngineAccessRefused;
use App\Engine\Support\EngineAccess;
use PHPUnit\Framework\TestCase;

/**
 * The engine addresses only what it was granted: nothing by default, one frame's target, or one maintenance scope.
 */
final class EngineAccessTest extends TestCase
{
    public function test_with_no_grant_every_target_and_capability_is_refused(): void
    {
        $access = new EngineAccess();

        $this->assertRefused(fn () => $access->checkTarget(new StackTarget('a', 's')));
        $this->assertRefused(fn () => $access->checkMaintenance('launches.silence'));
    }

    public function test_a_frame_grant_allows_its_own_target_only(): void
    {
        $access = new EngineAccess();
        $access->grantFrame(new StackTarget('a', 's'), 'frame-1');

        $access->checkTarget(new StackTarget('a', 's'));
        $this->assertRefused(fn () => $access->checkTarget(new StackTarget('a', 'other')));
        $this->assertRefused(fn () => $access->checkMaintenance('launches.silence'));
    }

    public function test_a_maintenance_grant_allows_its_capability_only(): void
    {
        $access = new EngineAccess();
        $access->grantMaintenance('launches.silence');

        $access->checkMaintenance('launches.silence');
        $this->assertRefused(fn () => $access->checkMaintenance('other'));
        $this->assertRefused(fn () => $access->checkTarget(new StackTarget('a', 's')));
    }

    public function test_clear_takes_the_grant_back(): void
    {
        $access = new EngineAccess();
        $access->grantFrame(new StackTarget('a', 's'), 'frame-1');
        $access->clear();

        $this->assertRefused(fn () => $access->checkTarget(new StackTarget('a', 's')));
    }

    private function assertRefused(callable $check): void
    {
        try {
            $check();
            $this->fail('The engine was not refused.');
        } catch (EngineAccessRefused) {
            $this->addToAssertionCount(1);
        }
    }
}
