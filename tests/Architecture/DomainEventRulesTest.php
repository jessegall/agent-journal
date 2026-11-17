<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Domain\DomainRegistry;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Tests\Architecture\Support\BoundaryChecker;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\ProjectRoots;
use Tests\Architecture\Support\Violation;
use Tests\Fixtures\Boundary\Events\Chat\ChatDomain;
use Tests\Fixtures\Boundary\Events\Plans\PlansDomain;
use Tests\Fixtures\Boundary\Events\Tasks\TasksDomain;

final class DomainEventRulesTest extends TestCase
{
    private const string TASK_CLOSED = 'Tests\Fixtures\Boundary\Events\Tasks\Events\TaskClosed';

    /**
     * @return iterable<string, array{string}>
     */
    public static function passingFiles(): iterable
    {
        yield 'a listener importing a declared domain event' => ['Plans/Listeners/StartNextTask.php'];
        yield 'a listener with an alias import' => ['Plans/Listeners/AliasListener.php'];
        yield 'a listener with a group import' => ['Plans/Listeners/GroupListener.php'];
        yield 'the owner raising its own event' => ['Tasks/Actions/CloseTask.php'];
    }

    #[DataProvider('passingFiles')]
    public function test_hearing_an_event_in_a_listener_passes(string $fixture): void
    {
        $this->assertSame([], $this->violationLines($fixture));
    }

    public function test_building_another_domain_event_in_a_listener_fails(): void
    {
        $this->assertSame([
            '13 names '.self::TASK_CLOSED.', an event of Tasks; only a listener of Plans may name it, as an import, a type or ::class',
        ], $this->violationLines('Plans/Listeners/RaisesTaskClosed.php'));
    }

    public function test_naming_another_domain_event_outside_a_listener_fails(): void
    {
        $this->assertSame([
            '7 names '.self::TASK_CLOSED.', an event of Tasks; only a listener of Plans may name it, as an import, a type or ::class',
            '13 names '.self::TASK_CLOSED.', an event of Tasks; only a listener of Plans may name it, as an import, a type or ::class',
        ], $this->violationLines('Plans/Actions/UsesTaskClosed.php'));
    }

    public function test_an_event_of_an_undeclared_domain_fails_in_a_listener(): void
    {
        $this->assertSame([
            '7 uses Tests\Fixtures\Boundary\Events\Chat\Events\MessageSent, but Plans does not require Chat',
            '11 uses Tests\Fixtures\Boundary\Events\Chat\Events\MessageSent, but Plans does not require Chat',
        ], $this->violationLines('Plans/Listeners/HearsMessage.php'));
    }

    /**
     * @return list<string>
     */
    private function violationLines(string $fixture): array
    {
        $registry = DomainRegistry::from([TasksDomain::class, ChatDomain::class, PlansDomain::class]);
        $roots = ProjectRoots::fromComposer(dirname(__DIR__, 2).'/composer.json');
        $file = dirname($registry->get('Tasks')->folder).'/'.$fixture;

        return array_map(
            fn (Violation $violation) => "{$violation->line} {$violation->reason()}",
            (new BoundaryChecker($registry->all(), $roots))->violations(DomainFiles::usesIn([$file], $roots)),
        );
    }
}
