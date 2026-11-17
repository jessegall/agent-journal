<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Domain\DomainRegistry;
use PHPUnit\Framework\TestCase;
use Tests\Architecture\Support\BoundaryChecker;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\ProjectRoots;
use Tests\Architecture\Support\Violation;
use Tests\Fixtures\Boundary\HookStates\Hooks\HooksDomain;
use Tests\Fixtures\Boundary\HookStates\Tasks\TasksDomain;

/**
 * A domain state takes the Hooks inputs it was declared to use; the Hooks events stay inside its listeners.
 */
final class HookBoundaryTest extends TestCase
{
    public function test_a_state_may_take_a_hook_input_of_a_declared_hooks_domain(): void
    {
        $this->assertSame([], $this->violationLines('Tasks/States/WorkingOnTask.php'));
    }

    public function test_a_listener_may_hear_a_hooks_event(): void
    {
        $this->assertSame([], $this->violationLines('Tasks/Listeners/RegisterTaskState.php'));
    }

    public function test_a_hooks_event_named_outside_a_listener_fails(): void
    {
        $this->assertCount(2, $this->violationLines('Tasks/States/ListensInTheWrongPlace.php'));
    }

    /**
     * @return list<string>
     */
    private function violationLines(string $fixture): array
    {
        $registry = DomainRegistry::from([HooksDomain::class, TasksDomain::class]);
        $roots = ProjectRoots::fromComposer(dirname(__DIR__, 2).'/composer.json');
        $file = dirname($registry->get('Hooks')->folder).'/'.$fixture;

        return array_map(
            fn (Violation $violation) => "{$violation->line} {$violation->reason()}",
            (new BoundaryChecker($registry->all(), $roots))->violations(DomainFiles::usesIn([$file], $roots)),
        );
    }
}
