<?php

declare(strict_types=1);

namespace Tests\Feature\Domains;

use App\Domains\Exceptions\InvalidListener;
use App\Domains\Providers\DomainEventServiceProvider;
use Domain\Plans\Api\Events\PlanProgressChanged;
use Domain\Plans\States\WorkingOnPlanState;
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
        $this->cachePath = (string) tempnam(sys_get_temp_dir(), 'events-cache-').'.php';
        file_put_contents(
            $this->cachePath,
            '<?php return '.var_export([DomainEventServiceProvider::class => [
                DomainEventServiceProvider::LANES => [DomainEventServiceProvider::LANES_VERSION],
                DomainEventServiceProvider::STATE_EVENTS => [implode('|', [
                    PlanProgressChanged::class,
                    WorkingOnPlanState::class,
                    WorkingOnPlanState::class,
                    'onPlanProgressChanged',
                    'Plans',
                    'wide',
                ])],
            ]], true).';',
        );
        $this->useEventCachePath($this->cachePath);

        parent::setUp();
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
