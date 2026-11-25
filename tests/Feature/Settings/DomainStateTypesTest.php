<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use App\Commands\Settings\DisableSettingGroup\DisableSettingGroupCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\Stack\StateTypes;
use App\Values\GroupReference;
use App\Values\OwnerAuthority;
use Domain\Tasks\Support\States\WorkOnTaskState;
use Domain\Tasks\TasksDomain;
use Tests\Fixtures\Domains\QuestionReminders\QuestionRemindersDomain;
use Tests\Fixtures\Domains\QuestionReminders\States\AwaitAnswerState;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
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
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    /**
     * The bus commits the switch command for real, so this table is emptied around each test.
     */
    private const array TABLES = ['settings_records'];

    public function test_a_domain_state_type_is_registered_from_its_state_class(): void
    {
        $types = $this->app->make(StateTypes::class)->registry();
        $working = $types->get('tasks.work');

        $this->assertSame(WorkOnTaskState::class, $working->stateClass);
        $this->assertSame(1, $working->schemaVersion);
        $this->assertTrue($types->get('core.ready')->isEnabled());
    }

    public function test_a_domains_ticking_state_type_still_ticks(): void
    {
        $this->bootModules(QuestionRemindersDomain::class);
        $types = $this->app->make(StateTypes::class);

        $this->assertSame(AwaitAnswerState::class, $types->registry()->get(AwaitAnswerState::TYPE_KEY)->stateClass);

        $this->assertTrue($types->ticking()->contains(AwaitAnswerState::TYPE_KEY));
        $this->assertFalse($types->ticking()->contains('tasks.work'));
    }

    public function test_switching_the_owner_off_switches_its_state_type_off(): void
    {
        $ownerId = TestIds::of(7);
        $this->app->instance(AccessSettings::class, new AccessSettings($ownerId));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser($ownerId), new OwnerAuthority('test'));
        $working = $this->app->make(StateTypes::class)->registry()->get('tasks.work');
        $this->assertTrue($working->isEnabled());

        $this->app->make(CommandBus::class)->run(
            new DisableSettingGroupCommand(new GroupReference('Core', 'domain_tasks'), 0),
        );

        $this->app->forgetScopedInstances();

        $this->assertFalse($working->isEnabled());
    }
}
