<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Core\CoreApi;
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
     * @return iterable<string, array{string, list<string>}>
     */
    public static function eventFixtures(): iterable
    {
        $onlyAListener = ', an event of Tasks; only a listener of Plans may name it, as an import, a type or ::class';
        $notExported = ", which Tasks does not export; add it to Tasks's exports() if it is meant to be public, or use what Tasks exports";

        yield 'a listener importing a declared domain event' => ['Plans/Listeners/StartNextTask.php', []];
        yield 'a listener with an alias import' => ['Plans/Listeners/AliasListener.php', []];
        yield 'a listener with a group import, naming a descriptor outside its own descriptor' => ['Plans/Listeners/GroupListener.php', [
            '7 uses Tests\Fixtures\Boundary\Events\Tasks\TasksDomain'.$notExported,
            '13 uses Tests\Fixtures\Boundary\Events\Tasks\TasksDomain'.$notExported,
        ]];
        yield 'the owner raising its own event' => ['Tasks/Actions/CloseTask.php', []];
        yield 'a listener building another domain event' => ['Plans/Listeners/RaisesTaskClosed.php', [
            '13 names '.self::TASK_CLOSED.$onlyAListener,
        ]];
        yield 'another domain event named outside a listener' => ['Plans/Actions/UsesTaskClosed.php', [
            '7 names '.self::TASK_CLOSED.$onlyAListener,
            '13 names '.self::TASK_CLOSED.$onlyAListener,
        ]];
        yield 'an event of an undeclared domain in a listener' => ['Plans/Listeners/HearsMessage.php', [
            '7 uses Tests\Fixtures\Boundary\Events\Chat\Events\MessageSent, but Plans does not require Chat',
            '11 uses Tests\Fixtures\Boundary\Events\Chat\Events\MessageSent, but Plans does not require Chat',
        ]];
    }

    /**
     * @param  list<string>  $expected
     */
    #[DataProvider('eventFixtures')]
    public function test_each_event_name_is_judged_by_where_it_is_named(string $fixture, array $expected): void
    {
        $this->assertSame($expected, $this->violationLines($fixture));
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
            (new BoundaryChecker($registry->all(), $roots, CoreApi::exports()))->violations(DomainFiles::usesIn([$file], $roots)),
        );
    }
}
