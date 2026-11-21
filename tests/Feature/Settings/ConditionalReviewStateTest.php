<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Support\AgentContext;
use App\Agents\Values\StackTarget;
use App\Bus\Contracts\CommandBus;
use App\Domains\Support\DomainEntry;
use App\Domains\Support\DomainRegistry;
use App\Hooks\Actions\AgentStacks;
use App\Hooks\Actions\StartStacks;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Storage\FrameRecord;
use App\Hooks\Support\StackTransaction;
use App\Settings\Exceptions\SettingsUnavailable;
use App\Settings\Models\SettingsRecord;
use App\Settings\Storage\EncodedToggle;
use App\Settings\Storage\EncodedValue;
use App\Settings\Support\CoreSettings;
use App\Settings\Support\RegisteredSettingCommands;
use App\Settings\Support\SettingRegistry;
use Carbon\CarbonImmutable;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Domains\Reviews\ReviewsDomain;
use Tests\Fixtures\Domains\Reviews\Settings\ReviewSettings;
use Tests\Fixtures\Domains\Reviews\States\ReviewState;
use Tests\Fixtures\Domains\Reviews\States\ReviewStateType;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The Reviews fixture's state follows its review group: pushed while the group is on, declined and later removed
 * while it is off, read through the reader of the request running now, and never quietly off on a failed read.
 */
final class ConditionalReviewStateTest extends TestCase
{
    use CommitsHookRows;

    /**
     * Stacks and settings are committed for real by the stack transaction and the bus.
     */
    private const array TABLES = ['agent_stacks', 'settings_records'];

    private ReviewSettings $reviews;

    private StackTarget $target;

    protected function setUp(): void
    {
        parent::setUp();

        $registry = DomainRegistry::from([ReviewsDomain::class])->settingDeclarations(new CoreSettings());
        $this->app->instance(SettingRegistry::class, $registry);
        $this->reviews = $registry->definition('Reviews');
        $this->app->instance(ReviewSettings::class, $this->reviews);
        DomainEntry::fromClass(ReviewsDomain::class)->boot($this->app);

        $ownerId = TestIds::of(7);
        $this->app->instance(AccessSettings::class, new AccessSettings($ownerId));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser($ownerId), new OwnerAuthority('test'));
        $this->target = TestActors::stack(1, 10);
        $this->app->instance(
            AgentContext::class,
            new AgentContext(
                TestIds::of(1),
                TestIds::of(10),
                new SignedCall('call-1', CarbonImmutable::now(), str_repeat('a', 64)),
                null,
            ),
        );
        $this->transaction()->run(fn () => $this->app->make(StartStacks::class)->open($this->target));
    }

    public function test_while_the_group_is_on_a_push_adds_the_review_frame(): void
    {
        $this->pushReview();

        $this->assertSame(['hooks.ready', ReviewStateType::TYPE_KEY], $this->storedTypeKeys());
    }

    public function test_while_the_group_is_off_a_push_is_declined_and_a_stored_frame_is_removed_for_good(): void
    {
        $this->pushReview();
        $this->switchReview(off: true, expectedRevision: 0);

        $this->pushReview();
        $this->assertSame(['hooks.ready'], $this->storedTypeKeys());

        $this->switchReview(off: false, expectedRevision: 1);

        $this->assertSame(
            ['hooks.ready'],
            $this->storedTypeKeys(),
            'Switching the group on again brings back no removed frame.',
        );
    }

    public function test_a_retained_factory_reads_the_settings_of_each_request(): void
    {
        $factory = $this->app->make(ReviewStateType::class);
        $references = new StateReferences([new StateReference(ReviewStateType::TYPE_KEY, NoSubject::None)]);

        $first = $factory->statesFor($references)->stateAt(0);
        $this->assertInstanceOf(ReviewState::class, $first);
        $this->assertTrue($first->isEnabled());
        $this->assertSame(3, $first->retryLimit());

        SettingsRecord::insertIfAbsent('Reviews');
        $record = SettingsRecord::sharedRuntimeForOwner('Reviews')->get();
        $record->revise($record->document->withToggle(new EncodedToggle('review', EncodedValue::of(false))));

        $sameRequest = $factory->statesFor($references)->stateAt(0);
        $this->assertInstanceOf(ReviewState::class, $sameRequest);
        $this->assertTrue($sameRequest->isEnabled(), 'One request reads the owner once.');

        $this->app->forgetScopedInstances();
        $nextRequest = $factory->statesFor($references)->stateAt(0);
        $this->assertInstanceOf(ReviewState::class, $nextRequest);
        $this->assertFalse($nextRequest->isEnabled());
    }

    public function test_a_failed_settings_read_is_an_error_never_off(): void
    {
        $factory = $this->app->make(ReviewStateType::class);
        DB::beginTransaction();
        Schema::drop('settings_records');

        try {
            $factory->statesFor(new StateReferences([new StateReference(ReviewStateType::TYPE_KEY, NoSubject::None)]));
            $this->fail('A failed settings read built a state.');
        } catch (SettingsUnavailable) {
            $this->addToAssertionCount(1);
        } finally {
            DB::rollBack();
        }
    }

    private function pushReview(): void
    {
        $this->transaction()->run(
            fn () => $this->app->make(AgentStacks::class)->push(
                $this->target,
                new StateReference(ReviewStateType::TYPE_KEY, NoSubject::None),
            ),
        );
    }

    private function switchReview(bool $off, int $expectedRevision): void
    {
        $commands = new RegisteredSettingCommands($this->app->make(SettingRegistry::class));
        $command = $off ? $commands->disable(
            $this->reviews->review,
            $expectedRevision,
        ) : $commands->enable($this->reviews->review, $expectedRevision);

        $this->app->make(CommandBus::class)->run($command);
    }

    private function transaction(): StackTransaction
    {
        return $this->app->make(StackTransaction::class);
    }

    /**
     * @return list<string>
     */
    private function storedTypeKeys(): array
    {
        return array_map(
            fn (FrameRecord $frame) => $frame->reference->typeKey,
            AgentStackRow::query()->forTarget($this->target)->sole()->frames->all(),
        );
    }
}
