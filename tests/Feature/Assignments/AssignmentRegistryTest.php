<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Actors\Enums\ActorType;
use App\Assignments\Contracts\AssignableProvider;
use App\Assignments\Contracts\AssigneeProvider;
use App\Assignments\Exceptions\AssigneeTypeRepeated;
use App\Assignments\Exceptions\AssignmentProviderInvalid;
use App\Assignments\Exceptions\AssignmentTypeRepeated;
use App\Assignments\Exceptions\AssignmentTypeUnavailable;
use App\Assignments\Registry\AssignmentRegistry;
use App\Assignments\Support\AssigneeRegistration;
use App\Links\Exceptions\UnknownLinkType;
use App\Links\Support\LinkTypeRegistry;
use App\Records\Exceptions\InvalidRecordIdentity;
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

        $this->registry = new AssignmentRegistry($this->app);
        $this->registry->registerOwner('Tests', []);
    }

    public function test_a_record_type_is_declared_once_with_an_assignable_provider(): void
    {
        $provider = $this->createStub(AssignableProvider::class);
        $this->app->instance($provider::class, $provider);

        $this->registry->registerRecord('tests.record', $provider::class, 'Tests');

        $this->assertSame($provider, $this->registry->recordProvider('tests.record'));
        $this->expectException(AssignmentTypeRepeated::class);

        $this->registry->registerRecord('tests.record', $provider::class, 'Tests');
    }

    public function test_a_type_that_is_no_alias_or_a_provider_of_the_wrong_type_is_refused(): void
    {
        $provider = $this->createStub(AssignableProvider::class)::class;

        $this->assertThrows(
            fn () => $this->registry->registerRecord('Tasks', $provider, 'Tests'),
            InvalidRecordIdentity::class,
        );
        // A module's descriptor is read at runtime, so a wrong class must be refused even though the types forbid it.
        $this->assertThrows(
            fn () => $this->registry->registerRecord('tests.record', self::class, 'Tests'), // @phpstan-ignore argument.type
            AssignmentProviderInvalid::class,
        );
        $this->assertThrows(
            fn () => $this->registry->registerAssignees(
                new AssigneeRegistration(ActorType::User, self::class), // @phpstan-ignore argument.type
            ),
            AssignmentProviderInvalid::class,
        );
    }

    public function test_an_actor_type_is_declared_once(): void
    {
        $provider = $this->createStub(AssigneeProvider::class);
        $this->app->instance($provider::class, $provider);
        $this->registry->registerAssignees(new AssigneeRegistration(ActorType::User, $provider::class));

        $this->assertSame($provider, $this->registry->assigneeProvider(ActorType::User));
        $this->expectException(AssigneeTypeRepeated::class);

        $this->registry->registerAssignees(new AssigneeRegistration(ActorType::User, $provider::class));
    }

    public function test_an_undeclared_type_or_type_is_unavailable(): void
    {
        $this->assertThrows(fn () => $this->registry->recordProvider('tests.record'), AssignmentTypeUnavailable::class);
        $this->assertThrows(
            fn () => $this->registry->assigneeProvider(ActorType::Agent),
            AssignmentTypeUnavailable::class,
        );
    }

    public function test_an_alias_registered_after_the_type_passes_once_its_model_is_assignable(): void
    {
        $provider = $this->createStub(AssignableProvider::class)::class;
        $this->registry->registerRecord('tests.late-record', $provider, 'Tests');

        $this->assertThrows(
            fn () => $this->registry->checkRecordModels($this->app->make(LinkTypeRegistry::class)),
            UnknownLinkType::class,
        );

        $this->app->make(LinkTypeRegistry::class)->register(['tests.late-record' => User::class]);

        $this->expectException(AssignmentProviderInvalid::class);
        $this->expectExceptionMessage('does not implement Assignable');

        $this->registry->checkRecordModels($this->app->make(LinkTypeRegistry::class));
    }

    public function test_the_application_boots_with_the_registry_bound_and_its_types_checked(): void
    {
        $this->assertInstanceOf(AssignmentRegistry::class, $this->app->make(AssignmentRegistry::class));
        $this->assertSame(Plan::class, $this->app->make(LinkTypeRegistry::class)->modelFor('plans.plan'));
    }
}
