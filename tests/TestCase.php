<?php

declare(strict_types=1);

namespace Tests;

use App\Contracts\Files\Files;
use App\Enums\Files\Place;
use App\Models\Projects\Project;
use App\Support\Domain;
use App\Support\DomainRegistry;
use App\Support\OuterTransactionOwner;
use App\Support\OutputRecorder;
use App\Support\OutsideCommandAllowance;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\DatabaseManager;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Events\ConnectionEstablished;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Foundation\Testing\WithCachedConfig;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Translation\Translator;
use Laravel\Fortify\Features;
use PDO;
use Tests\Support\Exceptions\DatabaseUsedWithoutHookDatabase;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;
use Tests\Support\TimeLimits\Exceptions\TestTimedOut;
use Tests\Support\TimeLimits\TestAlarm;
use Throwable;

/**
 * Every feature test's base: the configuration files are read once per process and kept, as Laravel's own
 * WithCachedConfig does, so a test's boot loads none of them again.
 */
abstract class TestCase extends BaseTestCase
{
    use WithCachedConfig;

    /**
     * @var array<string, class-string<Model>> the application's morph map, before a test adds fixture types to it
     */
    private array $applicationMorphMap = [];

    /**
     * The journal this test arranges, acts on and asserts against, made anew with each application.
     */
    protected TestJournal $journal;

    protected function setUp(): void
    {
        parent::setUp();

        $this->applicationMorphMap = Relation::morphMap();
        Http::preventStrayRequests();
        $this->withoutVite();
        $this->app->make(OuterTransactionOwner::class)->register();
        $this->app->make(Translator::class)->addNamespace('tests', base_path('tests/Fixtures/AgentTexts/lang'));
        $this->beforeApplicationDestroyed(fn () => $this->closeConnections());
        $this->keepProcessOutputApart();
    }

    /**
     * Points the process-output place at a folder of this worker's own, so a run one parallel worker cleans up or
     * fills never changes what another worker's admission reads.
     */
    private function keepProcessOutputApart(): void
    {
        $token = getenv('TEST_TOKEN') ?: 'alone';
        $folder = sys_get_temp_dir()."/journal-process-output-{$token}";
        File::ensureDirectoryExists($folder, Place::ProcessOutput->folderMode());
        config([Place::ProcessOutput->rootSetting() => (string) realpath($folder)]);
        $this->app->forgetInstance(Files::class);
        Storage::forgetDisk(OutputRecorder::DISK);
    }

    /**
     * Lets seeding saves run outside a command before any trait's own setUp writes rows.
     *
     * @return array<class-string, class-string>
     */
    protected function setUpTraits(): array
    {
        $this->app->make(OutsideCommandAllowance::class)->allow();

        return parent::setUpTraits();
    }

    /**
     * Rolls back what a test left open on any connection and closes each, after Laravel's own rollback: a failed
     * test's exception keeps its connection alive through the trace, and an open transaction there would hold the
     * locks the next test's table cleanup waits for.
     */
    /**
     * Fakes the named business events and keeps Eloquent's own events real, so the event unit still captures each
     * save; a bare Event::fake() would fake those too.
     */
    protected function fakeBusinessEvents(string ...$events): void
    {
        Event::fake($events);
    }

    protected function closeConnections(): void
    {
        foreach ($this->app->make(DatabaseManager::class)->getConnections() as $connection) {
            $pdo = $connection->getRawPdo();

            if ($pdo instanceof PDO && $pdo->inTransaction()) {
                $pdo->rollBack();
            }

            $connection->disconnect();
        }
    }

    /**
     * The alarm stops before the cleanup, so a slow test still empties the rows it committed; the morph map is static
     * and outlives the application, so a test's fixture types leave with it.
     */
    protected function tearDown(): void
    {
        if (TestAlarm::isAvailable()) {
            TestAlarm::disarm();
        }

        Relation::morphMap($this->applicationMorphMap, false);

        parent::tearDown();
    }

    /**
     * A test that ran out of time fails as the timeout, even when its own code caught the timeout and failed on
     * something else, such as an assertThrows that expected another exception.
     */
    protected function onNotSuccessfulTest(Throwable $failure): never
    {
        if (TestAlarm::hasRung() && ! $failure instanceof TestTimedOut) {
            TestAlarm::throwTimeout();
        }

        parent::onNotSuccessfulTest($failure);
    }

    /**
     * The application with only the domains this test case boots: none for a core test, so no domain hears or answers
     * core's events; a domain's test case boots that domain and the domains it requires.
     */
    public function createApplication(): Application
    {
        $booted = implode(',', static::bootedDomains());
        $_SERVER[DomainRegistry::BOOTED_DOMAINS] = $booted;
        putenv(DomainRegistry::BOOTED_DOMAINS.'='.$booted);

        return parent::createApplication();
    }

    /**
     * The domains this test case boots; a core test boots none.
     *
     * @return list<class-string<Domain>>
     */
    protected static function bootedDomains(): array
    {
        return [];
    }

    /**
     * Creates the application and, before any trait sets up, stops every query of a class without RefreshHookDatabase
     * and gives the test its journal for that application.
     */
    protected function refreshApplication(): void
    {
        parent::refreshApplication();

        if (! in_array(RefreshHookDatabase::class, class_uses_recursive(static::class), true)) {
            $this->refuseQueries($this->app->make(DatabaseManager::class));
        }

        $this->journal = new TestJournal($this->app, $this);
    }

    /**
     * The installation's own project, which an agent a test makes belongs to.
     */
    protected function localProject(): Project
    {
        return TestProjects::local();
    }

    protected function skipUnlessFortifyHas(string $feature, string|null $message = null): void
    {
        if (! Features::enabled($feature)) {
            $this->markTestSkipped($message ?? "Fortify feature [{$feature}] is not enabled.");
        }
    }

    /**
     * Refuses each statement before it runs, on the connections made so far and on every connection made later.
     */
    private function refuseQueries(DatabaseManager $database): void
    {
        $refuse = fn () => throw DatabaseUsedWithoutHookDatabase::by(static::class);

        foreach ($database->getConnections() as $connection) {
            $connection->beforeExecuting($refuse);
        }

        $this->app->make(Dispatcher::class)->listen(
            ConnectionEstablished::class,
            fn (ConnectionEstablished $event) => $event->connection->beforeExecuting($refuse),
        );
    }
}
