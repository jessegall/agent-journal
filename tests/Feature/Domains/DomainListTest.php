<?php

declare(strict_types=1);

namespace Tests\Feature\Domains;

use App\Domain\DomainEntry;
use App\Domain\DomainRegistry;
use App\Domain\Tasks\TasksDomain;
use Illuminate\Foundation\Support\Providers\EventServiceProvider;
use ReflectionProperty;
use Tests\TestCase;

final class DomainListTest extends TestCase
{
    public function test_the_registry_holds_exactly_the_approved_domains(): void
    {
        $registry = $this->app->make(DomainRegistry::class);

        $this->assertSame(
            ['Tasks', 'Plans', 'Chat', 'Memory', 'Rules', 'Sequences', 'Reminders', 'Profiles', 'Processes', 'Access', 'Web'],
            array_map(fn (DomainEntry $entry) => $entry->name, $registry->all()),
        );
        $this->assertStringEndsWith('/app/Domain/Plans', $registry->get('Plans')->folder);
        $this->assertSame([TasksDomain::class], $registry->get('Plans')->requires);
        $this->assertSame([], $registry->get('Tasks')->requires);
    }

    public function test_listeners_are_discovered_only_in_the_domain_and_core_listener_folders(): void
    {
        $registry = $this->app->make(DomainRegistry::class);
        $paths = collect((new ReflectionProperty(EventServiceProvider::class, 'eventDiscoveryPaths'))->getValue())->all();

        foreach ($registry->listenerFolders() as $folder) {
            $this->assertContains($folder, $paths);
        }

        $this->assertContains(app_path('Core/Hooks/Listeners'), $paths);

        $this->assertNotContains(app_path('Listeners'), $paths);
        $this->assertNotContains(app_path('Http/Listeners'), $paths);
    }

    public function test_the_app_boots_with_the_domains(): void
    {
        $this->artisan('about')->assertSuccessful();
    }
}
