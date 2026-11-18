<?php

declare(strict_types=1);

namespace Tests\Feature\Domains;

use App\Domains\Providers\DomainEventServiceProvider;
use App\Domains\Support\DomainEntry;
use App\Domains\Support\DomainRegistry;
use Domain\Tasks\TasksDomain;
use Tests\TestCase;

final class DomainListTest extends TestCase
{
    public function test_the_registry_holds_exactly_the_approved_domains(): void
    {
        $registry = $this->app->make(DomainRegistry::class);

        $this->assertSame(
            ['Tasks', 'Plans', 'Documents', 'Chat', 'Memory', 'Rules', 'Sequences', 'Reminders', 'Access', 'Helpers'],
            array_map(fn (DomainEntry $entry) => $entry->name, $registry->all()),
        );
        $this->assertStringEndsWith('/domain/Plans/src', $registry->get('Plans')->folder);
        $this->assertSame([TasksDomain::class], $registry->get('Plans')->requires);
        $this->assertSame([], $registry->get('Tasks')->requires);
        $this->assertSame([], $registry->get('Helpers')->requires);
        $this->assertStringEndsWith('/domain/Helpers/src', $registry->get('Helpers')->folder);
    }

    public function test_listeners_are_discovered_only_in_the_domain_and_core_listener_folders(): void
    {
        $registry = $this->app->make(DomainRegistry::class);
        $paths = new DomainEventServiceProvider($this->app)->discoverEventsWithin();

        foreach ($registry->listenerFolders() as $folder) {
            $this->assertContains($folder, $paths);
        }

        $this->assertContains(app_path('Hooks/Listeners'), $paths);

        $this->assertNotContains(app_path('Listeners'), $paths);
        $this->assertNotContains(app_path('Http/Listeners'), $paths);
    }

    public function test_the_app_boots_with_the_domains(): void
    {
        $this->artisan('about')->assertSuccessful();
    }
}
