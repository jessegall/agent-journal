<?php

declare(strict_types=1);

namespace Tests\Feature\Domains;

use App\Support\ReflectedProperty;
use App\Support\ReflectedType;
use Illuminate\Foundation\Support\Providers\EventServiceProvider;
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

    private function discoveryPathsProperty(): ReflectedProperty
    {
        return ReflectedType::of(EventServiceProvider::class)->property('eventDiscoveryPaths');
    }
}
