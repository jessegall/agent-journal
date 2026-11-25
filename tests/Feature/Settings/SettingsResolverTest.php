<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use App\Contracts\Settings\EnabledSettingsGroup;
use App\Contracts\Settings\SettingsResolver as SettingsResolverContract;
use App\Declarations\IntegerSetting;
use App\Exceptions\GroupSnapshotRequired;
use App\Exceptions\SettingHandleUnknown;
use App\Exceptions\SettingStorageInvalid;
use App\Exceptions\SettingsUnavailable;
use App\Exceptions\SettingUnavailable;
use App\Models\Records\SettingsRecord;
use App\Support\CoreSettings;
use App\Support\DisabledSettingsGroup;
use App\Support\DomainRegistry;
use App\Support\SettingRegistry;
use App\Support\SettingsResolver;
use App\Support\Storage\EncodedSetting;
use App\Support\Storage\EncodedToggle;
use App\Support\Storage\EncodedValue;
use App\Values\Decimal;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Domains\Reviews\Enums\ReviewLevel;
use Tests\Fixtures\Domains\Reviews\Enums\ReviewMode;
use Tests\Fixtures\Domains\Reviews\ReviewsDomain;
use Tests\Fixtures\Domains\Reviews\Settings\ReviewSettings;
use Tests\Support\CountsReads;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The reader gives each setting its stored override or its default without an actor, reads each owner's record once
 * per request, reads a group that can be switched off only as a whole, and never turns a failure into a default.
 */
final class SettingsResolverTest extends TestCase
{
    use CountsReads;
    use RefreshHookDatabase;

    private const string JOURNAL_NAME = 'My journal';

    private const string REVIEW_TITLE = 'Weekly reviews';

    private SettingRegistry $registry;

    private CoreSettings $core;

    private ReviewSettings $reviews;

    protected function setUp(): void
    {
        parent::setUp();

        $this->registry = DomainRegistry::from([ReviewsDomain::class])->settingDeclarations(new CoreSettings());
        $this->app->instance(SettingRegistry::class, $this->registry);
        $this->core = $this->registry->definition('Core');
        $this->reviews = $this->registry->definition('Reviews');
    }

    public function test_a_fresh_database_gives_the_default_and_creates_no_record(): void
    {
        $this->assertSame('Journal', $this->resolver()->string($this->core->displayName));
        $this->assertSame(0, SettingsRecord::query()->count());
    }

    public function test_an_override_is_read_once_per_request_and_a_new_request_sees_a_write(): void
    {
        $resolver = $this->resolver();
        $this->assertSame('Journal', $resolver->string($this->core->displayName));

        $this->storeSetting('Core', 'display_name', self::JOURNAL_NAME);

        $this->assertSame(0, $this->readCounts(fn () => $resolver->string($this->core->displayName))->queriesRun);
        $this->assertSame('Journal', $resolver->string($this->core->displayName));
        $this->assertSame(self::JOURNAL_NAME, $this->resolver()->string($this->core->displayName));

        $resolver->forget('Core');
        $this->assertSame(self::JOURNAL_NAME, $resolver->string($this->core->displayName));
    }

    public function test_a_setting_of_a_group_that_can_be_switched_off_is_not_read_on_its_own(): void
    {
        $this->expectException(GroupSnapshotRequired::class);

        $this->resolver()->integer($this->reviews->retryLimit);
    }

    public function test_a_setting_built_outside_the_registered_definition_is_unknown(): void
    {
        $this->expectException(SettingHandleUnknown::class);

        $this->resolver()->integer(IntegerSetting::make('retry_limit', 'Retry limit', 3));
    }

    public function test_a_group_follows_its_toggle_or_default_and_an_earlier_read_keeps_its_revision(): void
    {
        $this->storeSetting('Reviews', 'retry_limit', 7);
        $enabled = $this->resolver()->group($this->reviews->review);

        $this->assertInstanceOf(EnabledSettingsGroup::class, $enabled);
        $this->assertSame(1, $enabled->revision);
        $this->assertSame(7, $enabled->integer($this->reviews->retryLimit));
        $this->assertTrue($enabled->boolean($this->reviews->notifyOwner));
        $this->assertSame('0.50', $enabled->decimal($this->reviews->weight)->text);
        $this->assertSame('short', $enabled->choice($this->reviews->summaryStyle));
        $this->assertSame(ReviewMode::Quick, $enabled->enum($this->reviews->reviewMode));
        $this->assertSame(ReviewLevel::FirstPass, $enabled->enum($this->reviews->reviewLevel));

        $this->storeToggle('Reviews', 'review', false);
        $disabled = $this->resolver()->group($this->reviews->review);

        $this->assertInstanceOf(DisabledSettingsGroup::class, $disabled);
        $this->assertSame(['Reviews', 'review', 2], [$disabled->owner, $disabled->key, $disabled->revision]);
        $this->assertSame(1, $enabled->revision);
        $this->assertSame(7, $enabled->integer($this->reviews->retryLimit));
    }

    public function test_an_enabled_group_gives_only_its_own_settings(): void
    {
        $enabled = $this->resolver()->group($this->reviews->review);

        $this->expectException(SettingUnavailable::class);

        $this->assertInstanceOf(EnabledSettingsGroup::class, $enabled);
        $enabled->string($this->reviews->title);
    }

    public function test_an_invalid_toggle_is_an_error_neither_on_nor_off(): void
    {
        $this->storeToggle('Reviews', 'review', 1);

        $this->expectException(SettingStorageInvalid::class);

        $this->resolver()->group($this->reviews->review);
    }

    public function test_a_snapshot_reads_every_setting_of_an_owner_with_one_query(): void
    {
        $this->storeSetting('Reviews', 'title', self::REVIEW_TITLE);
        $resolver = $this->resolver();

        $counts = $this->readCounts(function () use ($resolver): void {
            $snapshot = $resolver->snapshot($this->reviews);
            $this->assertSame(self::REVIEW_TITLE, $snapshot->string($this->reviews->title));
            $this->assertSame(0, $snapshot->choice($this->reviews->priority));
            $review = $snapshot->group($this->reviews->review);
            $this->assertInstanceOf(EnabledSettingsGroup::class, $review);
            $this->assertSame(3, $review->integer($this->reviews->retryLimit));
            $this->assertTrue(Decimal::parse('0.50')->isEqualTo($review->decimal($this->reviews->weight)));
            $this->assertSame(1, $snapshot->revision);
        });

        $this->assertSame(1, $counts->queriesRun);
    }

    public function test_a_failed_read_is_an_error_and_never_a_default(): void
    {
        Schema::drop('settings_records');

        $this->expectException(SettingsUnavailable::class);

        $this->resolver()->string($this->core->displayName);
    }

    /**
     * The reader of a new request or job.
     */
    private function resolver(): SettingsResolver
    {
        $this->app->forgetScopedInstances();
        $resolver = $this->app->make(SettingsResolverContract::class);
        $this->assertInstanceOf(SettingsResolver::class, $resolver);

        return $resolver;
    }

    private function storeSetting(string $owner, string $key, mixed $value): void
    {
        SettingsRecord::create($owner);
        $record = SettingsRecord::lockedForOwner($owner);
        $record->revise($record->document->withSetting(new EncodedSetting($key, EncodedValue::of($value))));
    }

    private function storeToggle(string $owner, string $key, mixed $value): void
    {
        SettingsRecord::create($owner);
        $record = SettingsRecord::lockedForOwner($owner);
        $record->revise($record->document->withToggle(new EncodedToggle($key, EncodedValue::of($value))));
    }
}
