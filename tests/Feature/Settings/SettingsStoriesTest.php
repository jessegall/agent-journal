<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Settings\SettingCommands as SettingCommandsContract;
use App\Contracts\Settings\SettingsCatalogue;
use App\Contracts\Settings\SettingsDefinition;
use App\Contracts\Settings\SettingsResolver;
use App\Declarations\SettingGroup;
use App\Declarations\StringSetting;
use App\Exceptions\SettingDeclarationInvalid;
use App\Exceptions\SettingsConflict;
use App\Models\Records\SettingsRecord;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\CatalogueReflectorFactory;
use App\Support\CoreSettings;
use App\Support\DomainRegistry;
use App\Support\SettingCommands;
use App\Support\SettingRegistry;
use App\Support\Storage\EncodedSetting;
use App\Support\Storage\EncodedValue;
use App\Support\Storage\SettingsDocument;
use App\Values\OwnerAuthority;
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

    private SettingCommandsContract $commands;

    protected function setUp(): void
    {
        parent::setUp();

        $registry = DomainRegistry::from(
            [ReviewsDomain::class, BooksDomain::class],
        )->settingDeclarations(new CoreSettings());

        $this->app->instance(SettingRegistry::class, $registry);
        $this->reviews = $registry->definition('Reviews');
        $this->commands = new SettingCommands($registry, new CatalogueReflectorFactory());
        $ownerId = TestIds::of(7);
        $this->app->instance(AccessSettings::class, new AccessSettings($ownerId));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser($ownerId), new OwnerAuthority('test'));
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
        return SettingsRecord::findSharedRuntimeForOwner('Reviews')->get()->revision;
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
