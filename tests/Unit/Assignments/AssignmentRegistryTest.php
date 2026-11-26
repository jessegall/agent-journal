<?php

declare(strict_types=1);

namespace Tests\Unit\Assignments;

use App\Assignments\AssigneeDefinition;
use App\Assignments\Contracts\AssignableProvider;
use App\Assignments\Contracts\AssigneeProvider;
use App\Assignments\Enums\AssignmentPurpose;
use App\Assignments\Exceptions\AssigneeTypeRepeated;
use App\Assignments\Exceptions\AssignmentProviderInvalid;
use App\Exceptions\AssignmentTypeRepeated;
use App\Exceptions\AssignmentTypeUnavailable;
use App\Exceptions\UnknownLinkType;
use App\Links\LinkTypeRegistry;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Sharing\Exceptions\InvalidRecordIdentity;
use App\Support\Registry\AssignmentRegistry;
use Domain\Plans\Models\Plan;
use Domain\Plans\PlansDomain;
use Illuminate\Database\Eloquent\Relations\Relation;
use Tests\Support\DomainBoot;
use Tests\TestCase;

/**
 * The assignment registry: each record type and actor type is declared once with a provider of the right interface,
 * a provider is built only when asked for, and a declared type must be the link alias of an Assignable model once the
 * application has booted.
 */
final class AssignmentRegistryTest extends TestCase
{
    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    private AssignmentRegistry $registry;

    protected function setUp(): void
    {
        parent::setUp();

        $this->registry = new AssignmentRegistry();
        $this->registry->registerOwner('Tests', []);
    }

    public function test_a_record_type_is_declared_once_with_an_assignable_provider(): void
    {
        $provider = $this->createStub(AssignableProvider::class);
        $this->app->instance($provider::class, $provider);

        $this->registry->registerRecord('tests.record', $provider::class, 'Tests', AssignmentPurpose::PublicWork);

        $this->assertSame($provider, $this->registry->recordProvider('tests.record'));
        $this->expectException(AssignmentTypeRepeated::class);

        $this->registry->registerRecord('tests.record', $provider::class, 'Tests', AssignmentPurpose::PublicWork);
    }

    public function test_a_type_that_is_no_alias_or_a_provider_of_the_wrong_type_is_refused(): void
    {
        $provider = $this->createStub(AssignableProvider::class)::class;

        $this->assertThrows(
            fn () => $this->registry->registerRecord('Tasks', $provider, 'Tests', AssignmentPurpose::PublicWork),
            InvalidRecordIdentity::class,
        );
        // A module's descriptor is read at runtime, so a wrong class must be refused even though the types forbid it.
        $this->assertThrows(
            fn () => $this->registry->registerRecord(
                'tests.record',
                self::class, // @phpstan-ignore argument.type
                'Tests',
                AssignmentPurpose::PublicWork,
            ),
            AssignmentProviderInvalid::class,
        );
        $this->assertThrows(
            fn () => $this->registry->registerAssignees(
                new AssigneeDefinition(
                    User::storedType(),
                    self::class, // @phpstan-ignore argument.type
                ),
            ),
            AssignmentProviderInvalid::class,
        );
    }

    public function test_an_actor_type_is_declared_once(): void
    {
        $provider = $this->createStub(AssigneeProvider::class);
        $this->app->instance($provider::class, $provider);
        $this->registry->registerAssignees(
            new AssigneeDefinition(User::storedType(), $provider::class),
        );

        $this->assertSame($provider, $this->registry->assigneeProvider(User::storedType()));
        $this->expectException(AssigneeTypeRepeated::class);

        $this->registry->registerAssignees(
            new AssigneeDefinition(User::storedType(), $provider::class),
        );
    }

    public function test_an_undeclared_type_or_type_is_unavailable(): void
    {
        $this->assertThrows(fn () => $this->registry->recordProvider('tests.record'), AssignmentTypeUnavailable::class);
        $this->assertThrows(
            fn () => $this->registry->assigneeProvider(Agent::storedType()),
            AssignmentTypeUnavailable::class,
        );
    }

    public function test_an_alias_registered_after_the_type_passes_once_its_model_is_assignable(): void
    {
        $provider = $this->createStub(AssignableProvider::class)::class;
        $this->registry->registerRecord('tests.late-record', $provider, 'Tests', AssignmentPurpose::PublicWork);

        $this->assertThrows(
            fn () => $this->registry->checkRecordModels($this->app->make(LinkTypeRegistry::class)),
            UnknownLinkType::class,
        );

        Relation::morphMap(['tests.late-record' => User::class]);

        $this->expectException(AssignmentProviderInvalid::class);
        $this->expectExceptionMessage(
            AssignmentProviderInvalid::forModel('tests.late-record', User::class)->getMessage(),
        );

        $this->registry->checkRecordModels($this->app->make(LinkTypeRegistry::class));
    }

    public function test_the_application_boots_with_the_registry_bound_and_its_types_checked(): void
    {
        $this->assertInstanceOf(AssignmentRegistry::class, $this->app->make(AssignmentRegistry::class));
        $this->assertSame(Plan::class, $this->app->make(LinkTypeRegistry::class)->modelFor('plans.plan'));
    }
}
