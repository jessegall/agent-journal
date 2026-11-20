<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Domains\Bootstrappers\RegisterStates;
use App\Domains\Providers\DomainEventServiceProvider;
use App\Domains\Support\DomainRegistry;
use Tests\Fixtures\Modules\Cards\CardsDomain;
use Tests\Fixtures\Modules\Notes\NotesDomain;

/**
 * Adds the Notes fixture module to the application state declarations.
 */
trait RegistersNoteStates
{
    private function providerWithNotes(): DomainEventServiceProvider
    {
        $classes = DomainRegistry::installedClasses(base_path());
        $registry = DomainRegistry::from([...$classes, CardsDomain::class, NotesDomain::class]);
        $this->app->instance(DomainRegistry::class, $registry);
        $this->app->make(RegisterStates::class)($registry->get('Notes'));

        return new DomainEventServiceProvider($this->app);
    }
}
