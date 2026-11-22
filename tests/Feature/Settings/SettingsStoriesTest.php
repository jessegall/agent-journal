<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Domains\Support\DomainRegistry;
use App\Reflection\Support\CatalogueReflectorFactory;
use App\Settings\Contracts\SettingCommands;
use App\Settings\Contracts\SettingsCatalogue;
use App\Settings\Contracts\SettingsDefinition;
use App\Settings\Contracts\SettingsResolver;
use App\Settings\Declarations\IntegerSetting;
use App\Settings\Declarations\SettingGroup;
use App\Settings\Declarations\StringSetting;
use App\Settings\Enums\SettingsOutcome;
use App\Settings\Exceptions\SettingDeclarationInvalid;
use App\Settings\Exceptions\SettingsConflict;
use App\Settings\Exceptions\SettingStorageInvalid;
use App\Settings\Exceptions\SettingValueInvalid;
use App\Settings\Models\SettingsRecord;
use App\Settings\Storage\EncodedSetting;
use App\Settings\Storage\EncodedValue;
use App\Settings\Storage\SettingsDocument;
use App\Settings\Support\CoreSettings;
use App\Settings\Support\RegisteredSettingCommands;
use App\Settings\Support\SettingRegistry;
use Domain\Access\Support\AccessSettings;
use Illuminate\Database\Connection;
use Illuminate\Support\Str;
use Tests\Fixtures\Domains\Books\BooksDomain;
use Tests\Fixtures\Domains\Reviews\ReviewsDomain;
use Tests\Fixtures\Domains\Reviews\Settings\ReviewSettings;
use Tests\Support\CommitsHookRows;
use Tests\Support\Settings\ChangesReviewsSettings;
use Tests\Support\TestIds;
use Tests\Support\UsesSecondConnection;
use Tests\TestCase;

/**
 * The settings stories the phase tests left partly shown: local keys per owner, an owner without settings, races
 * between a switch and a child save and between two first writers, retries after a conflict, bounded input, labels
 * as text, unknown stored keys, and the group limit.
 */
final class SettingsStoriesTest extends TestCase
{
    use ChangesReviewsSettings;
    use CommitsHookRows;
    use UsesSecondConnection;

    /**
     * The bus commits the settings commands for real, so this table is emptied around each test.
     */
    private const array TABLES = ['settings_records'];

    private ReviewSettings $reviews;

    private SettingCommands $commands;

    protected function setUp(): void
    {
        parent::setUp();

        $registry = DomainRegistry::from(
            [ReviewsDomain::class, BooksDomain::class],
        )->settingDeclarations(new CoreSettings());
        $this->app->instance(SettingRegistry::class, $registry);
        $this->reviews = $registry->definition('Reviews');
        $this->commands = new RegisteredSettingCommands($registry, new CatalogueReflectorFactory());
        $ownerId = TestIds::of(7);
        $this->app->instance(AccessSettings::class, new AccessSettings($ownerId));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser($ownerId), new OwnerAuthority('test'));
    }

    /**
     * Story 2: two owners use one local key independently.
     */
    public function test_two_owners_may_use_the_same_local_key(): void
    {
        $first = new class implements SettingsDefinition
        {
            public readonly IntegerSetting $retryLimit;

            public function __construct()
            {
                $this->retryLimit = IntegerSetting::make('retry_limit', 'Retry limit', 1);
            }

            public function groups(): array
            {
                return [SettingGroup::make('general', 'General', [$this->retryLimit])];
            }
        };
        $second = new class implements SettingsDefinition
        {
            public readonly IntegerSetting $retryLimit;

            public function __construct()
            {
                $this->retryLimit = IntegerSetting::make('retry_limit', 'Retry limit', 2);
            }

            public function groups(): array
            {
                return [SettingGroup::make('general', 'General', [$this->retryLimit])];
            }
        };

        $registry = SettingRegistry::from(['Core' => new CoreSettings(), 'First' => $first, 'Second' => $second]);

        $this->assertSame(
            ['First', 'retry_limit'],
            [$registry->ownerOf($first->retryLimit)->owner, $registry->ownerOf($first->retryLimit)->key],
        );
        $this->assertSame(
            ['Second', 'retry_limit'],
            [$registry->ownerOf($second->retryLimit)->owner, $registry->ownerOf($second->retryLimit)->key],
        );
    }

    /**
     * Stories 3 and 53: a domain without settings contributes no groups, and its catalogue is empty, not unknown.
     */
    public function test_a_domain_without_settings_has_an_empty_catalogue(): void
    {
        $catalogue = $this->app->make(SettingsCatalogue::class)->owner('Books');

        $this->assertSame([], $catalogue->groups);
        $this->assertSame(0, $catalogue->revision);
    }

    /**
     * Story 26: a switch and a child save made at the same revision cannot both succeed.
     */
    public function test_a_child_save_made_at_the_revision_before_a_switch_is_a_conflict(): void
    {
        $this->runCommand($this->commands->disable($this->reviews->review, 0));

        $this->assertRefused(SettingsConflict::class, $this->commands->integer($this->reviews->retryLimit, 4, 0));
        $this->assertSame(1, $this->revision());
    }

    /**
     * Stories 30 and 31: a value equal to the default stays an override until it is reset.
     */
    public function test_a_saved_default_is_an_override_until_reset(): void
    {
        $this->runCommand($this->commands->string($this->reviews->title, 'Reviews', 0));
        $this->assertSame('override', $this->catalogueSetting('general', 'title')['source']);

        $this->runCommand($this->commands->reset($this->reviews->title, 1));
        $this->assertSame('default', $this->catalogueSetting('general', 'title')['source']);
    }

    /**
     * Story 32: a runtime read of an invalid stored value fails instead of giving the default.
     */
    public function test_a_runtime_read_of_an_invalid_value_fails(): void
    {
        $this->storeDirectly(
            fn (SettingsDocument $document) => $document->withSetting(
                new EncodedSetting('title', EncodedValue::of(42)),
            ),
        );

        $this->expectException(SettingStorageInvalid::class);

        $this->freshReader()->string($this->reviews->title);
    }

    /**
     * Story 34: after a conflict, a retry at the current revision succeeds.
     */
    public function test_a_stale_tab_is_refused_and_a_retry_at_the_new_revision_succeeds(): void
    {
        $this->runCommand($this->commands->integer($this->reviews->retryLimit, 4, 0));
        $this->assertRefused(SettingsConflict::class, $this->commands->integer($this->reviews->retryLimit, 5, 0));

        $change = $this->runCommand($this->commands->integer($this->reviews->retryLimit, 5, 1));

        $this->assertSame([2, SettingsOutcome::Changed], [$change->revision, $change->outcome]);
    }

    /**
     * Story 35: a first write that loses to another connection's committed first write gets a conflict, never a
     * unique-key error, and one record exists.
     */
    public function test_a_first_writer_that_loses_the_race_gets_a_conflict_and_one_record_exists(): void
    {
        $this->otherConnection()->table('settings_records')->insert([
            'id' => strtolower((string) Str::ulid()),
            'owner' => 'Reviews',
            'revision' => 1,
            'document' => '{"settings":[{"key":"retry_limit","value":7}],"toggles":[]}',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->assertRefused(SettingsConflict::class, $this->commands->integer($this->reviews->retryLimit, 4, 0));
        $this->assertSame(1, $this->otherConnection()->table('settings_records')->count());
        $this->assertSame(7, $this->freshReader()->group($this->reviews->review)->integer($this->reviews->retryLimit));
    }

    /**
     * Story 45: text past the largest a setting holds is refused before anything is stored, without the text.
     */
    public function test_oversized_text_is_refused_before_storage_without_echoing_it(): void
    {
        $text = str_repeat('x', StringSetting::LONGEST + 1);

        try {
            $this->runCommand($this->commands->string($this->reviews->title, $text, 0));
            $this->fail('Oversized text was stored.');
        } catch (SettingValueInvalid $refused) {
            $this->assertStringNotContainsString('xxxx', $refused->getMessage());
        }

        $this->assertSame(0, SettingsRecord::query()->count());
    }

    /**
     * Story 46: a label with markup is passed on as the same plain text.
     */
    public function test_a_label_with_markup_stays_plain_text(): void
    {
        $setting = StringSetting::make('motto', '<b>Motto</b>', 'Hello');

        $this->assertSame('<b>Motto</b>', $setting->label());
    }

    /**
     * Story 56: a stored key no declaration has is neither shown nor read.
     */
    public function test_an_unknown_stored_key_is_not_shown(): void
    {
        $this->storeDirectly(
            fn (SettingsDocument $document) => $document->withSetting(
                new EncodedSetting('retired_key', EncodedValue::of('old')),
            ),
        );

        $catalogue = $this->app->make(SettingsCatalogue::class)->owner('Reviews')->toArray();
        $keys = array_merge(
            ...array_map(
                fn (array $group) => array_column(array_column($group['settings'], 'identity'), 'key'),
                $catalogue['groups'],
            ),
        );

        $this->assertNotContains('retired_key', $keys);
    }

    /**
     * Story 57: more groups than an owner may declare is refused by name.
     */
    public function test_groups_past_the_limit_are_refused(): void
    {
        $groups = array_map(
            fn (int $number) => SettingGroup::make(
                "group_{$number}",
                "Group {$number}",
                [StringSetting::make("setting_{$number}", "Setting {$number}", 'x')],
            ),
            range(1, SettingRegistry::GROUPS_PER_OWNER + 1),
        );

        $this->expectException(SettingDeclarationInvalid::class);
        $this->expectExceptionMessage(
            SettingDeclarationInvalid::tooManyGroups('Many', SettingRegistry::GROUPS_PER_OWNER)->getMessage(),
        );

        SettingRegistry::from(['Core' => new CoreSettings(), 'Many' => $this->definitionOf($groups)]);
    }

    /**
     * @param  list<SettingGroup>  $groups
     */
    private function definitionOf(array $groups): SettingsDefinition
    {
        return new class($groups) implements SettingsDefinition
        {
            /**
             * @param  list<SettingGroup>  $groups
             */
            public function __construct(private readonly array $groups) {}

            public function groups(): array
            {
                return $this->groups;
            }
        };
    }

    private function revision(): int
    {
        return SettingsRecord::sharedRuntimeForOwner('Reviews')->get()->revision;
    }

    /**
     * @return array<string, mixed>
     */
    private function catalogueSetting(string $group, string $key): array
    {
        foreach ($this->app->make(SettingsCatalogue::class)->owner('Reviews')->toArray()['groups'] as $candidate) {
            foreach ($candidate['identity']['key'] === $group ? $candidate['settings'] : [] as $setting) {
                if ($setting['identity']['key'] === $key) {
                    return $setting;
                }
            }
        }

        $this->fail("The catalogue has no setting {$key} in group {$group}.");
    }

    private function freshReader(): SettingsResolver
    {
        $this->app->forgetScopedInstances();

        return $this->app->make(SettingsResolver::class);
    }
}
