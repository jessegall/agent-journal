<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Providers\DomainEventServiceProvider;
use App\Support\DomainEntry;
use App\Support\DomainRegistry;
use Domain\Comments\CommentsDomain;
use Domain\Tasks\TasksDomain;
use Tests\TestCase;

final class DomainListTest extends TestCase
{
    /**
     * Every installed domain, since the test reads the whole registry.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }

    public function test_the_registry_holds_exactly_the_approved_domains(): void
    {
        $registry = $this->app->make(DomainRegistry::class);

        $this->assertSame(
            [
                'Comments',
                'Tasks',
                'Plans',
                'Documents',
                'Chat',
                'Memory',
                'Rules',
                'Sequences',
                'Questions',
                'Reminders',
            ],
            array_map(fn (DomainEntry $entry) => $entry->name, $registry->all()),
        );
        $this->assertStringEndsWith('/domain/Plans/src', $registry->get('Plans')->folder);
        $this->assertSame([TasksDomain::class], $registry->get('Plans')->requires);
        $this->assertSame([CommentsDomain::class], $registry->get('Tasks')->requires);
    }

    public function test_listeners_are_discovered_only_in_the_domain_and_core_listener_folders(): void
    {
        $registry = $this->app->make(DomainRegistry::class);
        $paths = new DomainEventServiceProvider($this->app)->discoverEventsWithin();

        foreach ($registry->listenerFolders() as $folder) {
            $this->assertContains($folder, $paths);
        }

        $this->assertContains(app_path('Listeners'), $paths);
        $this->assertContains(app_path('Mcp/Listeners'), $paths);
        $this->assertNotContains(app_path('Http/Listeners'), $paths);
    }
}
