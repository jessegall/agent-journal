<?php

declare(strict_types=1);

namespace Tests\Feature\Domains;

use App\Domains\Exceptions\NotADomain;
use App\Domains\Exceptions\RequiredDomainMissing;
use App\Domains\Providers\DomainEventServiceProvider;
use App\Domains\Providers\DomainServiceProvider;
use App\Domains\Support\DomainRegistry;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Database\Migrations\Migrator;
use Illuminate\Foundation\Support\Providers\EventServiceProvider;
use ReflectionProperty;
use Tests\Fixtures\Domains\Books\BooksDomain;
use Tests\Fixtures\Domains\Plans\PlansDomain;
use Tests\Fixtures\Domains\Shelves\Events\BookShelved;
use Tests\Fixtures\Domains\Shelves\Listeners\CountShelvedBook;
use Tests\Fixtures\Domains\Shelves\ShelvesDomain;
use Tests\Fixtures\Domains\Tasks\TaskList;
use Tests\Fixtures\Domains\Tasks\TasksDomain;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

final class DomainServiceProviderTest extends TestCase
{
    use RefreshHookDatabase;

    private mixed $discoveryPathsBefore;

    protected function setUp(): void
    {
        $this->discoveryPathsBefore = $this->discoveryPathsProperty()->getValue();

        parent::setUp();
    }

    protected function tearDown(): void
    {
        parent::tearDown();

        $this->discoveryPathsProperty()->setValue(null, $this->discoveryPathsBefore);
    }

    public function test_the_migrations_of_every_domain_are_found(): void
    {
        $this->registerDomains([ShelvesDomain::class, BooksDomain::class, TasksDomain::class]);

        $migrator = $this->app->make(Migrator::class);
        $files = array_keys($migrator->getMigrationFiles($migrator->paths()));

        $this->assertContains('2026_01_01_000000_create_shelves_table', $files);
        $this->assertContains('2026_01_01_000001_create_books_table', $files);
    }

    public function test_a_domain_event_maps_to_its_listener(): void
    {
        $this->registerDomains([ShelvesDomain::class]);

        $events = (new DomainEventServiceProvider($this->app))->discoverEvents();

        $this->assertSame([CountShelvedBook::class.'@handle'], $events[BookShelved::class]);
    }

    public function test_the_discovery_paths_are_the_domain_listener_folders(): void
    {
        $this->registerDomains([ShelvesDomain::class, BooksDomain::class]);

        $paths = (new DomainEventServiceProvider($this->app))->discoverEventsWithin();
        $folders = $this->app->make(DomainRegistry::class)->listenerFolders();

        $this->assertSame($folders, array_values(array_intersect($paths, $folders)));
        $this->assertNotContains(app_path('Http/Listeners'), $paths);
        $this->assertNotContains(app_path('Listeners'), $paths);
    }

    public function test_a_list_holding_a_class_that_is_no_domain_stops_the_app(): void
    {
        $this->expectExceptionObject(NotADomain::for(TaskList::class));

        $this->registerDomains([TaskList::class]);
    }

    public function test_a_missing_required_domain_stops_the_app(): void
    {
        $this->expectExceptionObject(RequiredDomainMissing::for('Plans', 'Tasks'));

        $this->registerDomains([PlansDomain::class]);
    }

    public function test_the_registry_is_one_object(): void
    {
        $this->assertSame($this->app->make(DomainRegistry::class), $this->app->make(DomainRegistry::class));
    }

    public function test_the_app_runs_with_the_registered_domains(): void
    {
        $this->artisan('about')->assertSuccessful();
        $this->artisan('migrate')->assertSuccessful();
        $this->artisan('event:list')->assertSuccessful();
    }

    /**
     * @param  list<string>  $classes
     */
    private function registerDomains(array $classes): void
    {
        $this->app->register(new class($this->app, $classes) extends DomainServiceProvider
        {
            /**
             * @param  list<string>  $classes
             */
            public function __construct(Application $app, private readonly array $classes)
            {
                parent::__construct($app);
            }

            protected function domainClasses(): array
            {
                return $this->classes;
            }
        });
    }

    private function discoveryPathsProperty(): ReflectionProperty
    {
        return new ReflectionProperty(EventServiceProvider::class, 'eventDiscoveryPaths');
    }
}
