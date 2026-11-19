<?php

declare(strict_types=1);

namespace Tests\Support\Settings;

use App\Actors\Support\ActorContext;
use App\Domains\Support\DomainRegistry;
use App\Domains\Support\DomainSwitches;
use App\Settings\Contracts\SettingCommands;
use App\Settings\Support\CoreSettings;
use App\Settings\Support\RegisteredSettingCommands;
use App\Settings\Support\SettingRegistry;
use Domain\Access\Support\AccessSettings;
use Tests\Fixtures\Domains\Reviews\ReviewsDomain;
use Tests\Fixtures\Domains\Reviews\Settings\ReviewSettings;
use Tests\Fixtures\Modules\Cards\CardsDomain;
use Tests\Fixtures\Modules\Ledger\LedgerDomain;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\Support\ActsAsActors;
use Tests\Support\TestIds;

/**
 * The settings of the Reviews fixture domain alone, their commands, and test user 7 acting as the owner.
 */
trait UsesReviewsSettings
{
    use ActsAsActors;

    private ReviewSettings $reviews;

    private SettingCommands $commands;

    private string $ownerId;

    protected function setUpUsesReviewsSettings(): void
    {
        $this->holdSettings(DomainRegistry::from([ReviewsDomain::class])->settingDeclarations(new CoreSettings()));
        $this->ownerId = TestIds::of(7);
        $this->app->instance(AccessSettings::class, new AccessSettings($this->ownerId));
        $this->actAs(ActorContext::forUser($this->ownerId));
    }

    /**
     * The settings of the installed domains, Reviews and the test modules, with their switches, as the application
     * registers them when the modules are installed beside Reviews.
     */
    private function useSettingsBesideTestModules(): void
    {
        $domains = DomainRegistry::from([
            ...DomainRegistry::installedClasses(base_path()),
            ReviewsDomain::class,
            CardsDomain::class,
            LedgerDomain::class,
            NotesDomain::class,
        ]);
        $switches = $domains->domainSwitches();
        $this->app->instance(DomainSwitches::class, $switches);
        $this->holdSettings($domains->settingDeclarations(new CoreSettings($switches->groups())));
    }

    /**
     * The given settings and their commands as the only ones registered.
     */
    private function holdSettings(SettingRegistry $registry): void
    {
        $this->app->instance(SettingRegistry::class, $registry);
        $this->reviews = $registry->definition('Reviews');
        $this->commands = new RegisteredSettingCommands($registry);
    }
}
