<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Bus\Contracts\CommandBus;
use App\Domains\Support\DomainRegistry;
use App\Settings\Contracts\SettingCommands;
use App\Settings\Contracts\SettingsCatalogue;
use App\Settings\Exceptions\SettingsAccessDenied;
use App\Settings\Exceptions\SettingsOwnerUnknown;
use App\Settings\Models\SettingsRecord;
use App\Settings\Storage\EncodedSetting;
use App\Settings\Storage\EncodedToggle;
use App\Settings\Storage\EncodedValue;
use App\Settings\Storage\SettingsDocument;
use App\Settings\Support\CoreSettings;
use App\Settings\Support\RegisteredSettingCommands;
use App\Settings\Support\SettingRegistry;
use Closure;
use Domain\Access\Support\AccessSettings;
use Tests\Fixtures\Domains\Reviews\ReviewsDomain;
use Tests\Fixtures\Domains\Reviews\Settings\ReviewSettings;
use Tests\Support\AssertsReadBudget;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The owner inspects one owner's settings from one record read: every group and setting in declaration order with
 * its type, constraints, default and stored value, invalid stored values marked so they can be reset, and nobody else
 * sees any of it.
 */
final class SettingsCatalogueTest extends TestCase
{
    use AssertsReadBudget;
    use CommitsHookRows;

    /**
     * The reset runs through the bus, which commits for real, so this table is emptied around each test.
     */
    private const array TABLES = ['settings_records'];

    private ReviewSettings $reviews;

    private SettingCommands $commands;

    private string $ownerId;

    protected function setUp(): void
    {
        parent::setUp();

        $registry = DomainRegistry::from([ReviewsDomain::class])->settingDeclarations(new CoreSettings);
        $this->app->instance(SettingRegistry::class, $registry);
        $this->reviews = $registry->definition('Reviews');
        $this->commands = new RegisteredSettingCommands($registry);
        $this->ownerId = TestIds::of(7);
        $this->app->instance(AccessSettings::class, new AccessSettings($this->ownerId));
        $this->actAs(ActorContext::forUser($this->ownerId));
    }

    public function test_the_owner_sees_every_group_and_setting_in_order_with_types_constraints_and_defaults(): void
    {
        $catalogue = $this->catalogue('Reviews');

        $this->assertSame(['Reviews', 'Settings', 0], [$catalogue['owner'], $catalogue['title'], $catalogue['revision']]);
        $this->assertSame(['general', 'review'], array_column(array_column($catalogue['groups'], 'identity'), 'key'));
        $this->assertSame(['state' => 'enabled', 'defaultEnabled' => true], $catalogue['groups'][1]['availability']);
        $this->assertSame(['state' => 'always'], $catalogue['groups'][0]['availability']);

        $this->assertSame(['retry_limit', 'notify_owner', 'weight', 'summary_style', 'review_mode', 'review_level'], array_column(array_column($catalogue['groups'][1]['settings'], 'identity'), 'key'));
        $retry = $catalogue['groups'][1]['settings'][0];
        $this->assertSame(['integer', 'default', 'available'], [$retry['type'], $retry['source'], $retry['availability']]);
        $this->assertSame(['value' => 3, 'type' => 'integer'], $retry['default']);
        $this->assertSame(['minimum' => 0, 'maximum' => 10, 'type' => 'integer'], $retry['constraints']);
        $this->assertArrayNotHasKey('configured', $retry);
        $this->assertArrayNotHasKey('constraints', $catalogue['groups'][1]['settings'][1]);
        $this->assertSame(['value' => '0.50', 'type' => 'decimal'], $catalogue['groups'][1]['settings'][2]['default']);
        $this->assertSame(['precision' => 5, 'scale' => 2, 'type' => 'decimal'], $catalogue['groups'][1]['settings'][2]['constraints']);
        $this->assertSame('stringChoice', $catalogue['groups'][1]['settings'][4]['constraints']['type']);
        $this->assertSame(['value' => 1, 'type' => 'integerChoice'], $catalogue['groups'][1]['settings'][5]['default']);
        $this->assertSame('integerChoice', $catalogue['groups'][0]['settings'][1]['constraints']['type']);
    }

    public function test_an_invalid_stored_value_shows_as_invalid_and_a_reset_at_the_shown_revision_restores_the_default(): void
    {
        $this->storeDirectly('Reviews', fn (SettingsDocument $document) => $document
            ->withSetting(new EncodedSetting('retry_limit', EncodedValue::of('secret text')))
            ->withSetting(new EncodedSetting('title', EncodedValue::of('Weekly'))));

        $catalogue = $this->catalogue('Reviews');
        $retry = $catalogue['groups'][1]['settings'][0];
        $this->assertSame(1, $catalogue['revision']);
        $this->assertSame(['override', ['type' => 'invalid']], [$retry['source'], $retry['configured']]);
        $this->assertSame(['owner' => 'Reviews', 'key' => 'retry_limit', 'canonicalKey' => 'Reviews.retry_limit'], $retry['identity']);
        $this->assertSame(['value' => 'Weekly', 'type' => 'string'], $catalogue['groups'][0]['settings'][0]['configured']);
        $this->assertStringNotContainsString('secret text', json_encode($catalogue, JSON_THROW_ON_ERROR));

        $this->app->make(CommandBus::class)->run($this->commands->reset($this->reviews->retryLimit, $catalogue['revision']));

        $retry = $this->catalogue('Reviews')['groups'][1]['settings'][0];
        $this->assertSame('default', $retry['source']);
        $this->assertArrayNotHasKey('configured', $retry);
    }

    public function test_an_invalid_core_name_leaves_every_catalogue_usable_and_the_title_is_always_settings(): void
    {
        $this->storeDirectly('Core', fn (SettingsDocument $document) => $document->withSetting(new EncodedSetting('display_name', EncodedValue::of([1, 2]))));

        $core = $this->catalogue('Core');
        $this->assertSame('Settings', $core['title']);
        $this->assertSame(['type' => 'invalid'], $core['groups'][0]['settings'][0]['configured']);
        $this->assertSame('Settings', $this->catalogue('Reviews')['title']);
    }

    public function test_a_switched_off_group_keeps_its_values_and_an_invalid_switch_marks_its_settings(): void
    {
        $this->storeDirectly('Reviews', fn (SettingsDocument $document) => $document
            ->withToggle(new EncodedToggle('review', EncodedValue::of(false)))
            ->withSetting(new EncodedSetting('retry_limit', EncodedValue::of(6))));

        $review = $this->catalogue('Reviews')['groups'][1];
        $this->assertSame('disabled', $review['availability']['state']);
        $this->assertSame(['group_disabled', ['value' => 6, 'type' => 'integer']], [$review['settings'][0]['availability'], $review['settings'][0]['configured']]);

        $this->storeDirectly('Reviews', fn (SettingsDocument $document) => $document->withToggle(new EncodedToggle('review', EncodedValue::of('off'))));

        $review = $this->catalogue('Reviews')['groups'][1];
        $this->assertSame(['state' => 'invalid', 'defaultEnabled' => true], $review['availability']);
        $this->assertSame(['group_invalid', ['value' => 6, 'type' => 'integer']], [$review['settings'][0]['availability'], $review['settings'][0]['configured']]);
    }

    public function test_one_catalogue_reads_one_record(): void
    {
        $this->storeDirectly('Reviews', fn (SettingsDocument $document) => $document->withSetting(new EncodedSetting('retry_limit', EncodedValue::of(6))));

        $this->assertSame(1, $this->readCounts(fn () => $this->catalogue('Reviews'))->queriesRun);
    }

    public function test_an_owner_that_registers_no_settings_is_unknown(): void
    {
        $this->expectException(SettingsOwnerUnknown::class);

        $this->catalogue('Nobody');
    }

    public function test_an_agent_another_user_and_nobody_are_refused_before_any_read(): void
    {
        $this->actAs(ActorContext::forAgent(TestIds::of(3)));
        $this->assertRefusedWithoutReading();

        $this->actAs(ActorContext::forUser(TestIds::of(8)));
        $this->assertRefusedWithoutReading();

        $this->app->forgetScopedInstances();
        $this->assertFalse($this->app->make(CurrentActor::class)->hasActor());
        $this->assertRefusedWithoutReading();
    }

    private function assertRefusedWithoutReading(): void
    {
        $refused = false;
        $counts = $this->readCounts(function () use (&$refused): void {
            try {
                $this->catalogue('Reviews');
            } catch (SettingsAccessDenied) {
                $refused = true;
            }
        });

        $this->assertTrue($refused, 'The catalogue was not refused.');
        $this->assertSame(0, $counts->queriesRun);
    }

    private function actAs(ActorContext $actor): void
    {
        $this->app->make(CurrentActorSetter::class)->set($actor);
    }

    /**
     * @return array<string, mixed>
     */
    private function catalogue(string $owner): array
    {
        return $this->app->make(SettingsCatalogue::class)->owner($owner)->toArray();
    }

    /**
     * @param  Closure(SettingsDocument): SettingsDocument  $change
     */
    private function storeDirectly(string $owner, Closure $change): void
    {
        SettingsRecord::insertIfAbsent($owner);
        $record = SettingsRecord::sharedRuntimeForOwner($owner)->get();
        $record->revise($change($record->document));
    }
}
