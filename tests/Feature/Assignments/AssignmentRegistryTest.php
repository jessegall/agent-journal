<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Contracts\Assignments\AssignableProvider;
use App\Contracts\Assignments\AssigneeProvider;
use App\Enums\ActorType;
use App\Enums\AssignmentPurpose;
use App\Exceptions\AssigneeTypeRepeated;
use App\Exceptions\AssignmentProviderInvalid;
use App\Exceptions\AssignmentTypeRepeated;
use App\Exceptions\AssignmentTypeUnavailable;
use App\Exceptions\InvalidRecordIdentity;
use App\Exceptions\UnknownLinkType;
use App\Support\AssigneeDefinition;
use App\Support\LinkTypeRegistry;
use App\Support\Registry\AssignmentRegistry;
use Domain\Access\Models\User;
use Domain\Plans\Models\Plan;
use Tests\TestCase;

/**
 * The assignment registry: each record type and actor type is declared once with a provider of the right interface,
 * a provider is built only when asked for, and a declared type must be the link alias of an Assignable model once the
 * application has booted.
 */
final class AssignmentRegistryTest extends TestCase
{
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
                    ActorType::User->value,
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
            new AssigneeDefinition(ActorType::User->value, $provider::class),
        );

        $this->assertSame($provider, $this->registry->assigneeProvider(ActorType::User->value));
        $this->expectException(AssigneeTypeRepeated::class);

        $this->registry->registerAssignees(
            new AssigneeDefinition(ActorType::User->value, $provider::class),
        );
    }

    public function test_an_undeclared_type_or_type_is_unavailable(): void
    {
        $this->assertThrows(fn () => $this->registry->recordProvider('tests.record'), AssignmentTypeUnavailable::class);
        $this->assertThrows(
            fn () => $this->registry->assigneeProvider(ActorType::Agent->value),
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

        $this->app->make(LinkTypeRegistry::class)->register(['tests.late-record' => User::class]);

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
