<?php

declare(strict_types=1);

namespace Tests\Machinery\Domains;

use App\Exceptions\NotADomain;
use App\Exceptions\RequiredDomainMissing;
use App\Listeners\BroadcastPageChange;
use App\Providers\DomainEventServiceProvider;
use App\Providers\DomainServiceProvider;
use App\Support\DomainRegistry;
use App\Support\ReflectedProperty;
use App\Support\Reflector;
use App\Support\Stack\StateTypes;
use Domain\Comments\CommentsDomain;
use Domain\Comments\Events\CommentPosted;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Database\Migrations\Migrator;
use Illuminate\Events\Dispatcher;
use Illuminate\Foundation\Support\Providers\EventServiceProvider;
use Tests\Fixtures\Domains\Books\BooksDomain;
use Tests\Fixtures\Domains\Plans\PlansDomain;
use Tests\Fixtures\Domains\Shelves\Events\BookShelved;
use Tests\Fixtures\Domains\Shelves\Listeners\CountBookShelved;
use Tests\Fixtures\Domains\Shelves\Listeners\CountCommentPosted;
use Tests\Fixtures\Domains\Shelves\ShelvesDomain;
use Tests\Fixtures\Domains\Tasks\TaskList;
use Tests\Fixtures\Domains\Tasks\TasksDomain;
use Tests\Support\DomainBoot;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

final class DomainServiceProviderTest extends TestCase
{
    use RefreshHookDatabase;

    private mixed $discoveryPathsBefore;

    protected function setUp(): void
    {
        $this->discoveryPathsBefore = $this->discoveryPathsProperty()->readStatic();

        parent::setUp();
    }

    protected function tearDown(): void
    {
        parent::tearDown();

        $this->discoveryPathsProperty()->writeStatic($this->discoveryPathsBefore);
    }

    public function test_the_app_runs_with_the_registered_domains(): void
    {
        $this->artisan('about')->assertSuccessful();
        $this->artisan('migrate')->assertSuccessful();
        $this->artisan('event:list')->assertSuccessful();
    }

    public function test_the_migrations_of_every_domain_are_found(): void
    {
        $this->registerDomains(
            DomainBoot::withRequirements(ShelvesDomain::class, CommentsDomain::class, BooksDomain::class, TasksDomain::class),
        );

        $migrator = $this->app->make(Migrator::class);
        $files = array_keys($migrator->getMigrationFiles($migrator->paths()));

        $this->assertContains('2026_01_01_000000_create_shelves_table', $files);
        $this->assertContains('2026_01_01_000001_create_books_table', $files);
    }

    public function test_a_domain_event_maps_to_its_listener(): void
    {
        $this->registerDomains(DomainBoot::withRequirements(ShelvesDomain::class, CommentsDomain::class));

        $events = new DomainEventServiceProvider($this->app)->discoverEvents();

        $this->assertSame([CountBookShelved::class.'@handle'], $events[BookShelved::class]);
    }

    public function test_a_domain_listens_to_another_domains_exported_event(): void
    {
        $this->registerDomains(DomainBoot::withRequirements(ShelvesDomain::class, CommentsDomain::class));

        $events = new DomainEventServiceProvider($this->app)->discoverEvents();

        $this->assertEqualsCanonicalizing(
            [CountCommentPosted::class.'@handle', BroadcastPageChange::class.'@handle'],
            $events[CommentPosted::class],
        );
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

    private function discoveryPathsProperty(): ReflectedProperty
    {
        return Reflector::of(EventServiceProvider::class)->property('eventDiscoveryPaths');
    }

    /**
     * Registers only the named domains, with a state type registry that holds only what Core declares itself, as an
     * application booted with just these domains has.
     *
     * @param  list<string>  $classes
     */
    private function registerDomains(array $classes): void
    {
        $this->app->instance(StateTypes::class, new StateTypes(
            new Dispatcher($this->app),
            $this->app,
        ));
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
}
