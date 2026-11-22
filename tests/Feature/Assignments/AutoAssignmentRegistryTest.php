<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Assignments\Contracts\AssignedWorkProvider;
use App\Assignments\Enums\AssignmentPurpose;
use App\Assignments\Exceptions\AssignmentProviderInvalid;
use App\Assignments\Exceptions\AssignmentTypeUnavailable;
use App\Assignments\Exceptions\AutoAssignmentDeclarationRefused;
use App\Assignments\Registry\AssignmentRegistry;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AutoAssignerDefinition;
use App\Assignments\Support\PoolDefinition;
use App\Domains\Bootstrappers\RegisterAssignables;
use App\Domains\Support\Domain;
use App\Domains\Support\DomainEntry;
use Tests\Fixtures\Domains\Errands\ErrandAssignables;
use Tests\Fixtures\Domains\Errands\ErrandAssigner;
use Tests\Fixtures\Domains\Errands\ErrandsDomain;
use Tests\Fixtures\Domains\Errands\ErrandWork;
use Tests\Fixtures\Domains\Errands\OpenErrandPools;
use Tests\Fixtures\Domains\Rounds\RoundsDomain;
use Tests\TestCase;

/**
 * Domains declare auto-assigners and pools through AutoAssignmentProvider; the registry keeps them under the
 * declaring domain's name, builds each through the container on every lookup, and refuses at boot a declaration the
 * application cannot run with.
 */
final class AutoAssignmentRegistryTest extends TestCase
{
    private AssignmentRegistry $registry;

    protected function setUp(): void
    {
        parent::setUp();

        $this->registry = new AssignmentRegistry();
    }

    public function test_a_domains_assigner_and_pools_are_reachable_under_its_name(): void
    {
        $this->boot(ErrandsDomain::class, RoundsDomain::class);
        $this->registry->checkPools();

        $this->assertInstanceOf(ErrandAssigner::class, $this->registry->autoAssigner(ErrandsDomain::ERRAND));
        $this->assertInstanceOf(ErrandWork::class, $this->registry->assignedWork(ErrandsDomain::ERRAND));
        $this->assertInstanceOf(OpenErrandPools::class, $this->registry->poolFactory('rounds.errands'));
        $this->assertSame('Errands', $this->registry->recordOwner(ErrandsDomain::ERRAND));
        $this->assertSame('Errands', $this->registry->poolOwner('errands.open'));
        $this->assertSame('Rounds', $this->registry->poolOwner('rounds.errands'));
        $this->assertSame(
            ['errands.open', 'rounds.errands'],
            array_map(fn (PoolDefinition $pool) => $pool->key, $this->registry->pools(ErrandsDomain::ERRAND)),
        );
        $this->assertSame([], $this->registry->pools('tasks.task'));
    }

    public function test_a_pool_may_be_declared_before_its_types_owner_boots(): void
    {
        $this->boot(RoundsDomain::class, ErrandsDomain::class);

        $this->registry->checkPools();

        $this->assertSame('Rounds', $this->registry->poolOwner('rounds.errands'));
    }

    public function test_a_rebound_class_is_the_one_built(): void
    {
        $other = new class implements AssignedWorkProvider
        {
            public function countFor(AssigneeIdentity $holder): int
            {
                return 7;
            }
        };
        $this->boot(ErrandsDomain::class);

        $this->app->scoped(ErrandWork::class, fn () => $other);

        $this->assertSame($other, $this->registry->assignedWork(ErrandsDomain::ERRAND));
    }

    public function test_a_rebound_class_that_breaks_the_contract_is_refused(): void
    {
        $this->boot(ErrandsDomain::class);
        $this->app->scoped(ErrandAssigner::class, fn () => new ErrandWork());

        $this->expectException(AssignmentProviderInvalid::class);

        $this->registry->autoAssigner(ErrandsDomain::ERRAND);
    }

    public function test_an_undeclared_type_or_pool_is_unavailable(): void
    {
        $this->assertThrows(fn () => $this->registry->autoAssigner('tests.none'), AssignmentTypeUnavailable::class);
        $this->assertThrows(fn () => $this->registry->assignedWork('tests.none'), AssignmentTypeUnavailable::class);
        $this->assertThrows(fn () => $this->registry->poolFactory('tests.none'), AssignmentTypeUnavailable::class);
        $this->assertThrows(fn () => $this->registry->recordOwner('tests.none'), AssignmentTypeUnavailable::class);
        $this->assertThrows(fn () => $this->registry->poolOwner('tests.none'), AssignmentTypeUnavailable::class);
    }

    public function test_an_assigner_declared_twice_is_refused(): void
    {
        $this->boot(ErrandsDomain::class);

        $this->expectExceptionObject(AutoAssignmentDeclarationRefused::assignerRepeated(ErrandsDomain::ERRAND));

        $this->registry->registerAutoAssigner(
            new AutoAssignerDefinition(ErrandsDomain::ERRAND, ErrandAssigner::class, ErrandWork::class),
            'Errands',
        );
    }

    public function test_a_pool_key_declared_twice_is_refused(): void
    {
        $this->boot(ErrandsDomain::class);

        $this->expectExceptionObject(AutoAssignmentDeclarationRefused::poolRepeated('errands.open'));

        $this->registry->registerPool(self::pool('errands.open'), 'Errands');
    }

    public function test_a_class_that_does_not_implement_its_contract_is_refused(): void
    {
        $this->boot(ErrandsDomain::class);
        $this->registry->registerRecord(
            'errands.chore',
            ErrandAssignables::class,
            'Errands',
            AssignmentPurpose::PublicWork,
        );

        $this->assertThrows(
            fn () => $this->registry->registerAutoAssigner(
                new AutoAssignerDefinition('errands.chore', ErrandWork::class, ErrandWork::class),
                'Errands',
            ),
            AssignmentProviderInvalid::class,
        );
        $this->assertThrows(
            fn () => $this->registry->registerAutoAssigner(
                new AutoAssignerDefinition('errands.chore', ErrandAssigner::class, ErrandAssigner::class),
                'Errands',
            ),
            AssignmentProviderInvalid::class,
        );
        $this->assertThrows(
            fn () => $this->registry->registerPool(
                new PoolDefinition('errands.wrong', ErrandsDomain::ERRAND, ErrandWork::class, 'Wrong'),
                'Errands',
            ),
            AssignmentProviderInvalid::class,
        );
    }

    public function test_an_assigner_for_a_type_its_owner_did_not_register_is_refused(): void
    {
        $this->boot(ErrandsDomain::class, RoundsDomain::class);
        $this->registry->registerRecord(
            'errands.chore',
            ErrandAssignables::class,
            'Errands',
            AssignmentPurpose::PublicWork,
        );

        $this->assertThrows(
            fn () => $this->registry->registerAutoAssigner(
                new AutoAssignerDefinition('rounds.round', ErrandAssigner::class, ErrandWork::class),
                'Rounds',
            ),
            AutoAssignmentDeclarationRefused::class,
            AutoAssignmentDeclarationRefused::typeNotAssignable('rounds.round', 'Rounds')->getMessage(),
        );
        $this->assertThrows(
            fn () => $this->registry->registerAutoAssigner(
                new AutoAssignerDefinition('errands.chore', ErrandAssigner::class, ErrandWork::class),
                'Rounds',
            ),
            AutoAssignmentDeclarationRefused::class,
            AutoAssignmentDeclarationRefused::assignerOfAnotherOwner('errands.chore', 'Rounds', 'Errands')
                ->getMessage(),
        );
    }

    public function test_a_pool_whose_owner_neither_owns_nor_requires_its_type_is_refused(): void
    {
        $this->boot(ErrandsDomain::class);
        $this->registry->registerOwner('Strays', []);
        $this->registry->registerPool(self::pool('strays.errands'), 'Strays');

        $this->expectExceptionObject(
            AutoAssignmentDeclarationRefused::poolOfUnrelatedOwner('strays.errands', 'Strays', 'Errands'),
        );

        $this->registry->checkPools();
    }

    public function test_a_pool_of_a_type_no_domain_registered_is_refused(): void
    {
        $this->registry->registerOwner('Strays', []);
        $this->registry->registerPool(self::pool('strays.errands'), 'Strays');

        $this->expectExceptionObject(
            AutoAssignmentDeclarationRefused::typeNotAssignable(ErrandsDomain::ERRAND, 'Strays'),
        );

        $this->registry->checkPools();
    }

    public function test_an_unknown_or_repeated_owner_is_refused(): void
    {
        $this->assertThrows(
            fn () => $this->registry->registerPool(self::pool('strays.errands'), 'Strays'),
            AutoAssignmentDeclarationRefused::class,
            AutoAssignmentDeclarationRefused::ownerUnknown('Strays')->getMessage(),
        );
        $this->assertThrows(
            fn () => $this->registry->registerRecord(
                ErrandsDomain::ERRAND,
                ErrandAssignables::class,
                'Strays',
                AssignmentPurpose::PublicWork,
            ),
            AutoAssignmentDeclarationRefused::class,
            AutoAssignmentDeclarationRefused::ownerUnknown('Strays')->getMessage(),
        );

        $this->boot(ErrandsDomain::class);

        $this->expectExceptionObject(AutoAssignmentDeclarationRefused::ownerRepeated('Errands'));

        $this->boot(ErrandsDomain::class);
    }

    public function test_the_application_boots_with_its_pools_checked(): void
    {
        $this->app->make(AssignmentRegistry::class)->checkPools();

        $this->assertSame('Tasks', $this->app->make(AssignmentRegistry::class)->recordOwner('tasks.task'));
    }

    /**
     * @param  class-string<Domain>  ...$domains
     */
    private function boot(string ...$domains): void
    {
        foreach ($domains as $domain) {
            new RegisterAssignables($this->registry)(DomainEntry::fromClass($domain));
        }
    }

    private static function pool(string $key): PoolDefinition
    {
        return new PoolDefinition($key, ErrandsDomain::ERRAND, OpenErrandPools::class, 'Errands');
    }
}
