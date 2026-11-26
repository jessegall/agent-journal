<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Access\Contracts\JournalAdmission;
use App\Actors\ActorStore;
use App\Hooks\Exceptions\StateEventReentry;
use App\Hooks\StateEvents\StateEventActivity;
use App\Projects\Contracts\AgentProjects;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Modules\Notes\Events\NoteWritten;
use Tests\Support\Projects\BuildsCurrentProject;
use Tests\Support\TestActors;

final class StateEventActivityTest extends TestCase
{
    use BuildsCurrentProject;

    public function test_different_key_nesting_is_bounded_and_the_same_scope_accepts_later_deliveries(): void
    {
        $activity = new StateEventActivity($this->currentProject(
            new ActorStore(),
            $this->createStub(AgentProjects::class),
            $this->createStub(JournalAdmission::class),
        ));

        try {
            $this->nest($activity, 11);
            $this->fail('The eleventh level was accepted.');
        } catch (StateEventReentry $failure) {
            $this->assertSame(
                StateEventReentry::depth(10)->getMessage(),
                $failure->getMessage(),
            );
        }

        $this->assertSame(10, $this->nest($activity, 10));
    }

    private function nest(StateEventActivity $activity, int $remaining): int
    {
        if ($remaining === 0) {
            return 0;
        }

        return $activity->delivering(function () use ($activity, $remaining): int {
            $activity->trackOrigin(TestActors::stack(1, 10), "frame-{$remaining}", NoteWritten::class);

            return 1 + $this->nest($activity, $remaining - 1);
        });
    }
}
