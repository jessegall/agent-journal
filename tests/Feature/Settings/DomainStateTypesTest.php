<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Bus\Contracts\CommandBus;
use App\Domains\Support\DomainStateType;
use App\Domains\Support\DomainTickableStateType;
use App\Hooks\Contracts\ConditionalStateType;
use App\Hooks\Stack\StateTypes;
use App\Settings\Commands\DisableSettingGroup;
use App\Settings\Values\GroupReference;
use Domain\Access\Support\AccessSettings;
use Domain\Tasks\Resolvers\Support\TaskRecords;
use Domain\Tasks\States\Support\WorkingOnTaskStateFactory;
use Tests\Fixtures\Domains\QuestionReminders\QuestionRemindersDomain;
use Tests\Fixtures\Domains\QuestionReminders\States\AwaitingAnswerLoader;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsCommandModules;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Every domain state type is registered wrapped with its owner, enabled only while that domain is available, a ticking
 * one still marked as ticking; Core's ready states are registered as they are.
 */
final class DomainStateTypesTest extends TestCase
{
    use CommitsHookRows;
    use InstallsCommandModules;

    /**
     * The bus commits the switch command for real, so this table is emptied around each test.
     */
    private const array TABLES = ['settings_records'];

    public function test_a_domain_state_type_carries_its_owner_and_core_ready_states_do_not(): void
    {
        $types = $this->app->make(StateTypes::class)->registry();
        $working = $types->get('tasks.working');

        $this->assertInstanceOf(DomainStateType::class, $working);
        $this->assertSame('Tasks', $working->owner);
        $this->assertSame(
            new WorkingOnTaskStateFactory($this->app->make(TaskRecords::class))->schemaVersion(),
            $working->schemaVersion(),
        );
        $this->assertNotInstanceOf(ConditionalStateType::class, $types->get('hooks.ready'));
    }

    public function test_a_domains_ticking_state_type_is_wrapped_and_still_ticks(): void
    {
        $this->bootModules(QuestionRemindersDomain::class);
        $types = $this->app->make(StateTypes::class);

        $this->assertInstanceOf(
            DomainTickableStateType::class,
            $types->registry()->get(AwaitingAnswerLoader::TYPE_KEY),
        );
        $this->assertTrue($types->ticking()->contains(AwaitingAnswerLoader::TYPE_KEY));
        $this->assertFalse($types->ticking()->contains('tasks.working'));
    }

    public function test_switching_the_owner_off_switches_its_state_type_off(): void
    {
        $ownerId = TestIds::of(7);
        $this->app->instance(AccessSettings::class, new AccessSettings($ownerId));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser($ownerId), new OwnerAuthority('test'));
        $working = $this->app->make(StateTypes::class)->registry()->get('tasks.working');
        $this->assertInstanceOf(DomainStateType::class, $working);
        $this->assertTrue($working->isEnabled());

        $this->app->make(CommandBus::class)->run(
            new DisableSettingGroup(new GroupReference('Core', 'domain_tasks'), 0),
        );
        $this->app->forgetScopedInstances();

        $this->assertFalse($working->isEnabled());
    }
}
