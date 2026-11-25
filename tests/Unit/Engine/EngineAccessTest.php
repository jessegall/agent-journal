<?php

declare(strict_types=1);

namespace Tests\Unit\Engine;

use App\Exceptions\EngineAccessRefused;
use App\Support\ActorIdentity;
use App\Support\EngineAccess;
use App\Support\SystemActor;
use App\Values\StackTarget;
use PHPUnit\Framework\TestCase;

/**
 * The engine addresses only what it was granted: nothing by default, one frame's target, or one maintenance scope.
 */
final class EngineAccessTest extends TestCase
{
    public function test_with_no_grant_every_target_and_capability_is_refused(): void
    {
        $access = new EngineAccess();

        $this->assertRefused(fn () => $access->assertTargetGranted(new StackTarget('a', 's')));
        $this->assertRefused(fn () => $access->assertMaintenanceGranted('starts.silence'));
    }

    public function test_a_frame_grant_allows_its_own_target_only(): void
    {
        $access = new EngineAccess();
        $access->grantFrame(new StackTarget('a', 's'), 'frame-1');

        $access->assertTargetGranted(new StackTarget('a', 's'));
        $this->assertSame('frame-1', $access->frameGrantFor(new SystemActor())->get()->frameId);
        $this->assertTrue($access->frameGrantFor(ActorIdentity::forAgent(SystemActor::ID))->isEmpty());
        $this->assertRefused(fn () => $access->assertTargetGranted(new StackTarget('a', 'other')));
        $this->assertRefused(fn () => $access->assertMaintenanceGranted('starts.silence'));
    }

    public function test_a_maintenance_grant_allows_its_capability_only(): void
    {
        $access = new EngineAccess();
        $access->grantMaintenance('starts.silence');

        $access->assertMaintenanceGranted('starts.silence');
        $this->assertRefused(fn () => $access->assertMaintenanceGranted('other'));
        $this->assertRefused(fn () => $access->assertTargetGranted(new StackTarget('a', 's')));
    }

    public function test_clear_takes_the_grant_back(): void
    {
        $access = new EngineAccess();
        $access->grantFrame(new StackTarget('a', 's'), 'frame-1');
        $access->clear();

        $this->assertRefused(fn () => $access->assertTargetGranted(new StackTarget('a', 's')));
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
