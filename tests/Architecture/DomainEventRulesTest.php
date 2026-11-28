<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Bootstrap\CoreListenerFolders;
use App\Bus\Contracts\PipelineRunner;
use App\Bus\Exceptions\InvalidListener;
use App\Bus\ListenerOwnership;
use App\Reflection\CatalogueReflectorFactory;
use App\Stacks\Declarations\StateMethods;
use App\Stacks\StateListenerDeclarations;
use App\Stacks\StateTypes;
use App\Support\DomainRegistry;
use App\Support\Registration\ListenerRegistration;
use Tests\Architecture\Support\BoundaryChecker;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\EventCallScan;
use Tests\Architecture\Support\ProjectRoots;
use Tests\Architecture\Support\Violation;
use Tests\Architecture\Support\ViolationType;
use Tests\Fixtures\Boundary\Events\Chat\ChatDomain;
use Tests\Fixtures\Boundary\Events\Plans\PlansDomain;
use Tests\Fixtures\Boundary\Events\Plans\States\PlanState;
use Tests\Fixtures\Boundary\Events\Tasks\TasksDomain;
use Tests\Support\JudgesFixtureFiles;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;

#[TimeLimit(seconds: 15, reason: 'It parses the project files it judges.')]
final class DomainEventRulesTest extends TestCase
{
    use JudgesFixtureFiles;

    private const string TASK_CLOSED = 'Tests\Fixtures\Boundary\Events\Tasks\Events\TaskClosed';

    /**
     * @return iterable<string, array{string, list<string>}>
     */
    public static function fixtures(): iterable
    {
        $onlyAListener = ', an event of Tasks; only a listener of Plans may name it, as an import, a type or ::class';
        $notExported = ", which Tasks does not export; add it to Tasks's exports() if it is meant to be public, or use what Tasks exports";

        yield 'a listener importing a declared domain event' => ['Plans/Listeners/StartNextTask.php', []];

        yield 'a listener with an alias import' => ['Plans/Listeners/AliasListener.php', []];

        yield 'a state handler with an alias import' => ['Plans/States/PlanState.php', []];

        yield 'an unrelated state helper has no event permission' => [
            'Plans/States/PlanStateWithForeignUse.php',
            ['19 names '.self::TASK_CLOSED.$onlyAListener],
        ];

        yield 'a listener with a group import, naming a descriptor outside its own descriptor' => [
            'Plans/Listeners/GroupListener.php',
            [
                '7 uses Tests\Fixtures\Boundary\Events\Tasks\TasksDomain'.$notExported,
                '13 uses Tests\Fixtures\Boundary\Events\Tasks\TasksDomain'.$notExported,
            ],
        ];

        yield 'the owner raising its own event' => ['Tasks/Actions/CloseTask.php', []];

        yield 'a listener building another domain event' => ['Plans/Listeners/RaisesTaskClosed.php', [
            '13 names '.self::TASK_CLOSED.$onlyAListener,
        ]];

        yield 'another domain event named outside a listener' => ['Plans/Actions/UsesTaskClosed.php', [
            '7 names '.self::TASK_CLOSED.$onlyAListener,
            '13 names '.self::TASK_CLOSED.$onlyAListener,
        ]];

        yield 'an event of an undeclared domain in a listener' => ['Plans/Listeners/MessageListener.php', [
            '7 uses Tests\Fixtures\Boundary\Events\Chat\Events\MessageSent, but Plans does not require Chat',
            '11 uses Tests\Fixtures\Boundary\Events\Chat\Events\MessageSent, but Plans does not require Chat',
        ]];
    }

    public function test_state_event_permissions_and_manual_registration_use_the_listener_policy(): void
    {
        $registry = DomainRegistry::from([TasksDomain::class, PlansDomain::class]);
        $ownership = new ListenerOwnership($registry, CoreListenerFolders::all(), new CatalogueReflectorFactory(), app_path());
        $states = new StateListenerDeclarations($ownership, new CatalogueReflectorFactory());
        $policy = new ListenerRegistration($this->app->make(PipelineRunner::class), $ownership);
        $declaration = new StateMethods()->forState(PlanState::class)[self::TASK_CLOSED];

        $this->assertSame('Plans', $states->ownerOf(self::TASK_CLOSED, $declaration));
        $this->expectException(InvalidListener::class);
        $policy->discover([self::TASK_CLOSED => [PlanState::class.'@onTaskClosed']]);
    }

    public function test_a_state_listener_cannot_raise_the_event_it_received(): void
    {
        $registry = DomainRegistry::from([TasksDomain::class, PlansDomain::class]);
        $roots = ProjectRoots::fromComposer(dirname(__DIR__, 2).'/composer.json');
        $file = $registry->get('Plans')->folder.'/States/PlanStateWithForeignUse.php';
        $calls = ScanCache::findings(new EventCallScan(), [$file]);
        $violations = new BoundaryChecker($registry->all(), $roots)->eventCallViolations($calls);

        $this->assertSame([ViolationType::ReRaisedReceivedEvent], array_column($violations, 'type'));
    }

    public function test_the_installed_loaders_declare_valid_states(): void
    {
        $registry = $this->app->make(DomainRegistry::class);
        $states = new StateListenerDeclarations(
            new ListenerOwnership($registry, CoreListenerFolders::all(), new CatalogueReflectorFactory(), app_path()),
            new CatalogueReflectorFactory(),
        );
        $methods = new StateMethods();
        $types = $this->app->make(StateTypes::class)->registry()->types();

        $this->assertArrayHasKey('core.ready', $types);

        foreach ($types as $type) {
            foreach ($methods->forState($type->stateClass) as $input => $method) {
                if ($input !== $method->name) {
                    $states->ownerOf($input, $method);
                }
            }
        }
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
            new BoundaryChecker(
                $registry->all(),
                $roots,
            )->violations(DomainFiles::usesIn([$file], $roots)),
        );
    }
}
