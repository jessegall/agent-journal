<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Settings\SettingCommands as SettingCommandsContract;
use App\Contracts\Settings\SettingsDefinition;
use App\Declarations\SettingGroup;
use App\Declarations\StringSetting;
use App\Exceptions\SettingDeclarationInvalid;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use App\Support\CatalogueReflectorFactory;
use App\Support\CoreSettings;
use App\Support\DomainRegistry;
use App\Support\SettingCommands;
use App\Support\SettingRegistry;
use App\Values\OwnerAuthority;
use Tests\Fixtures\Domains\Books\BooksDomain;
use Tests\Fixtures\Domains\Reviews\ReviewsDomain;
use Tests\Fixtures\Domains\Reviews\Settings\ReviewSettings;
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
    use UsesSecondConnection;

    /**
     * The bus commits the settings commands for real, so this table is emptied around each test.
     */
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
        $this->app->make(CurrentActorSetter::class)->set(ActorIdentity::forUser($ownerId), new OwnerAuthority('test'));
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
}
