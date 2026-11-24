<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Contracts\Files\Files;
use App\Enums\Place;
use App\Http\Middleware\Web\HandleInertiaRequests;
use App\Support\InstallationFaults;
use App\Values\FilePath;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Http\Request;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * What the updater's supervisor could not heal (storage/installation/faults) reaches every signed-in page, one plain
 * sentence each, and nothing does once the file is empty or gone.
 */
final class InstallationFaultsTest extends TestCase
{
    use RefreshHookDatabase;

    private const string FAULT = 'The installation could not bring back agent-host: it is unhealthy.';

    private FilePath $faults;

    protected function setUp(): void
    {
        parent::setUp();

        $this->faults = FilePath::in(Place::Temporary, 'installation-faults-'.bin2hex(random_bytes(6)));
        $this->app->instance(
            InstallationFaults::class,
            new InstallationFaults($this->app->make(Files::class), $this->faults),
        );
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->actingAs($owner);
    }

    protected function tearDown(): void
    {
        $files = $this->app->make(Files::class);

        if ($files->exists($this->faults)) {
            $files->delete($this->faults);
        }

        parent::tearDown();
    }

    public function test_a_signed_in_page_shows_each_fault_the_installation_could_not_heal(): void
    {
        $this->app->make(Files::class)->write($this->faults, self::FAULT."\n");

        $this->assertSame([self::FAULT], $this->shared()['installationFaults']);
    }

    public function test_an_installation_with_nothing_unhealed_shows_nothing(): void
    {
        $this->assertSame([], $this->shared()['installationFaults']);
    }

    /**
     * @return array<string, mixed>
     */
    private function shared(): array
    {
        return $this->app->make(HandleInertiaRequests::class)->share(Request::create('/'));
    }
}
