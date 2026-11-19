<?php

declare(strict_types=1);

namespace Tests\Support\Settings;

use App\Actors\Support\ActorContext;
use App\Domains\Support\DomainRegistry;
use App\Settings\Contracts\SettingCommands;
use App\Settings\Support\CoreSettings;
use App\Settings\Support\RegisteredSettingCommands;
use App\Settings\Support\SettingRegistry;
use Domain\Access\Support\AccessSettings;
use Tests\Fixtures\Domains\Reviews\ReviewsDomain;
use Tests\Fixtures\Domains\Reviews\Settings\ReviewSettings;
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
        $registry = DomainRegistry::from([ReviewsDomain::class])->settingDeclarations(new CoreSettings());
        $this->app->instance(SettingRegistry::class, $registry);
        $this->reviews = $registry->definition('Reviews');
        $this->commands = new RegisteredSettingCommands($registry);
        $this->ownerId = TestIds::of(7);
        $this->app->instance(AccessSettings::class, new AccessSettings($this->ownerId));
        $this->actAs(ActorContext::forUser($this->ownerId));
    }
}
