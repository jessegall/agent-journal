<?php

declare(strict_types=1);

namespace Tests\Machinery\Settings;

use App\Access\AccessSettings;
use App\Access\Values\OwnerAuthority;
use App\Actors\Contracts\CurrentActorSetter;
use App\Api\SignedCall;
use App\Bus\Contracts\CommandBus;
use App\Exceptions\SettingsUnavailable;
use App\Models\Agents\AgentStackRow;
use App\Models\Records\SettingsRecord;
use App\Reflection\CatalogueReflectorFactory;
use App\Settings\CoreSettings;
use App\Settings\SettingCommands;
use App\Settings\SettingRegistry;
use App\Settings\Storage\EncodedToggle;
use App\Settings\Storage\EncodedValue;
use App\Stacks\AgentStacks;
use App\Stacks\Decisions\StateReferenceKeys;
use App\Stacks\StartStacks;
use App\Stacks\StateLoading\RegisteredStateType;
use App\Support\ActorReference;
use App\Support\AgentContext;
use App\Support\DomainEntry;
use App\Support\DomainRegistry;
use App\Support\StackTransaction;
use App\Support\StateLoading\StateBuilder;
use App\Support\Storage\FrameRecord;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Domains\Reviews\ReviewsDomain;
use Tests\Fixtures\Domains\Reviews\Settings\ReviewSettings;
use Tests\Fixtures\Domains\Reviews\States\ReviewState;
use Tests\Fixtures\Domains\Reviews\States\ReviewStateReference;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The Reviews fixture's state follows its review group: pushed while the group is on, declined and later removed
 * while it is off, read through the reader of the request running now, and never quietly off on a failed read.
 */
#[TestsMachinery(AgentStacks::class)]
final class ConditionalStatePushTest extends TestCase
{
    use CommitsHookRows;

    private const string NO_RESTORED_FRAME = 'Switching the group on again brings back no removed frame.';

    private const string ONE_READ = 'One request reads the owner once.';

    /**
     * Stacks and settings are committed for real by the stack transaction and the bus.
     */
    private const array TABLES = ['agent_stacks', 'settings_records'];

    private ReviewSettings $reviews;

    private StackTarget $target;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->placeBareAgentsInLocalProject();

        $registry = DomainRegistry::from([ReviewsDomain::class])->settingDeclarations(new CoreSettings());
        $this->app->instance(SettingRegistry::class, $registry);
        $this->reviews = $registry->definition('Reviews');
        $this->app->instance(ReviewSettings::class, $this->reviews);
        DomainEntry::fromClass(ReviewsDomain::class)->boot($this->app);

        $ownerId = TestIds::of(7);
        $this->app->instance(AccessSettings::class, new AccessSettings($ownerId));
        $this->app->make(CurrentActorSetter::class)->set(ActorReference::forUser($ownerId), new OwnerAuthority('test'));
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

        $this->assertSame(['core.ready', StateReferenceKeys::of(ReviewStateReference::class)], $this->storedTypeKeys());
    }

    public function test_while_the_group_is_off_a_push_is_declined_and_a_stored_frame_is_removed_for_good(): void
    {
        $this->pushReview();
        $this->switchReview(isOff: true, expectedRevision: 0);

        $this->pushReview();
        $this->assertSame(['core.ready'], $this->storedTypeKeys());

        $this->switchReview(isOff: false, expectedRevision: 1);

        $this->assertSame(
            ['core.ready'],
            $this->storedTypeKeys(),
            self::NO_RESTORED_FRAME,
        );
    }

    public function test_a_built_state_reads_the_settings_of_each_request(): void
    {
        $first = $this->builtReview();
        $this->assertInstanceOf(ReviewState::class, $first);
        $this->assertTrue($first->isEnabled());
        $this->assertSame(3, $first->retryLimit());

        SettingsRecord::create('Reviews');
        $record = SettingsRecord::findSharedRuntimeForOwner('Reviews')->get();
        $record->revise($record->document->withToggle(new EncodedToggle('review', EncodedValue::of(false))));

        $sameRequest = $this->builtReview();
        $this->assertInstanceOf(ReviewState::class, $sameRequest);
        $this->assertTrue($sameRequest->isEnabled(), self::ONE_READ);

        $this->app->forgetScopedInstances();
        $nextRequest = $this->builtReview();
        $this->assertInstanceOf(ReviewState::class, $nextRequest);
        $this->assertFalse($nextRequest->isEnabled());
    }

    public function test_a_failed_settings_read_is_an_error_never_off(): void
    {
        $review = $this->builtReview();
        DB::beginTransaction();
        Schema::drop('settings_records');

        try {
            $review->isEnabled();
            $this->fail('A failed settings read answered.');
        } catch (SettingsUnavailable) {
            $this->addToAssertionCount(1);
        } finally {
            DB::rollBack();
        }
    }

    private function builtReview(): ReviewState
    {
        $state = $this->app->make(StateBuilder::class)->build(RegisteredStateType::of(ReviewState::class), []);
        $this->assertInstanceOf(ReviewState::class, $state);

        return $state;
    }

    private function pushReview(): void
    {
        $this->transaction()->run(
            fn () => $this->app->make(AgentStacks::class)->push(
                $this->target,
                ReviewStateReference::withoutSubject(),
            ),
        );
    }

    private function switchReview(bool $isOff, int $expectedRevision): void
    {
        $commands = new SettingCommands($this->app->make(SettingRegistry::class), new CatalogueReflectorFactory());

        $command = $isOff ? $commands->disable(
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
