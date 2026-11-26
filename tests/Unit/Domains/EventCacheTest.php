<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Exceptions\InvalidListener;
use App\Providers\DomainEventServiceProvider;
use Tests\Support\SetsEventCachePath;
use Tests\TestCase;

/**
 * A cached boot reads the listeners from the events cache: a cache that holds no entry for the domain event provider
 * is refused by name instead of starting with no listeners.
 */
final class EventCacheTest extends TestCase
{
    use SetsEventCachePath;

    private string $cachePath;

    protected function setUp(): void
    {
        parent::setUp();

        // The app boots uncached, since the installed domains' state events would make any hand-written cache stale.
        $this->cachePath = (string) tempnam(sys_get_temp_dir(), 'events-cache-').'.php';
        $this->useEventCachePath($this->cachePath);
        $this->app->instance('events.cached', true);
    }

    protected function tearDown(): void
    {
        $this->useEventCachePath(null);
        @unlink($this->cachePath);

        parent::tearDown();
    }

    public function test_a_cache_without_the_domain_event_providers_entry_is_refused_by_name(): void
    {
        file_put_contents($this->cachePath, '<?php return [];');

        $this->expectException(InvalidListener::class);
        $this->expectExceptionMessage(DomainEventServiceProvider::class);

        new DomainEventServiceProvider($this->app)->getEvents();
    }
}
