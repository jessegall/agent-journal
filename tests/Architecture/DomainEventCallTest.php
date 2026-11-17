<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Domain\Contracts\Domain;
use App\Domain\DomainRegistry;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Architecture\Support\BoundaryChecker;
use Tests\Architecture\Support\BoundaryReport;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\EventCallScan;
use Tests\Architecture\Support\ParsedFile;
use Tests\Architecture\Support\ProjectRoots;
use Tests\Architecture\Support\Violation;
use Tests\Fixtures\Boundary\EventCalls\Plans\PlansDomain;
use Tests\Fixtures\Boundary\EventCalls\Tasks\TasksDomain;
use Tests\TestCase;

/**
 * Events are named by their class and raised only by their owner, by every form the scan can see.
 * It does not see a received event re-raised through a copied variable or from another method,
 * and a string passed to ->dispatch() on an injected dispatcher, which cannot be told from a job.
 */
final class DomainEventCallTest extends TestCase
{
    /**
     * @return iterable<string, array{string, list<string>}>
     */
    public static function eventCallFixtures(): iterable
    {
        yield 'string names where only an event can stand' => ['Plans/Actions/StringEvents.php', [
            '16 names the event task.closed by a string; name its event class instead',
            '17 names the event task.closed by a string; name its event class instead',
            '18 names the event [\'task.closed\'] by a string; name its event class instead',
            '19 names the event task.closed by a string; name its event class instead',
            '20 names the event task.closed by a string; name its event class instead',
        ]];
        yield 'an action raising its own events by class' => ['Plans/Actions/ClassEvents.php', []];
        yield 'a listener hearing an event by class' => ['Plans/Listeners/QuietListener.php', []];
    }

    /**
     * @param  list<string>  $expected
     */
    #[DataProvider('eventCallFixtures')]
    public function test_each_event_call_is_judged_by_how_it_names_its_event(string $fixture, array $expected): void
    {
        $this->assertSame($expected, $this->violationLines($fixture));
    }

    public function test_a_listener_passing_on_its_event_fails(): void
    {
        $this->assertSame(
            ['13 passes the event it received, $event, on to a raise; only the owner of an event raises it'],
            $this->violationLines('Plans/Listeners/PassesOnEvent.php'),
        );
    }

    public function test_raising_another_domain_event_by_its_class_fails(): void
    {
        $this->assertSame(
            ['14 raises Tests\Fixtures\Boundary\EventCalls\Tasks\Events\TaskClosed again, an event of Tasks; only its owner raises it'],
            $this->violationLines('Plans/Listeners/DispatchesByClass.php'),
        );
    }

    public function test_no_domain_of_the_real_app_names_or_raises_an_event_it_may_not(): void
    {
        $registry = $this->app->make(DomainRegistry::class);
        $folders = [dirname((string) (new \ReflectionClass(Domain::class))->getFileName())];
        $calls = [];

        foreach (DomainFiles::in($folders) as $file) {
            array_push($calls, ...EventCallScan::of(ParsedFile::fromPath($file)));
        }

        $violations = $this->checker($registry)->eventCallViolations($calls);

        $this->assertSame([], $violations, BoundaryReport::of($violations, base_path()));
    }

    /**
     * @return list<string>
     */
    private function violationLines(string $fixture): array
    {
        $registry = DomainRegistry::from([TasksDomain::class, PlansDomain::class]);
        $file = dirname($registry->get('Tasks')->folder).'/'.$fixture;

        return array_map(
            fn (Violation $violation) => "{$violation->line} {$violation->reason()}",
            $this->checker($registry)->eventCallViolations(EventCallScan::of(ParsedFile::fromPath($file))),
        );
    }

    private function checker(DomainRegistry $registry): BoundaryChecker
    {
        return new BoundaryChecker($registry->all(), ProjectRoots::fromComposer(base_path('composer.json')));
    }
}
