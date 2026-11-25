<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Http\Middleware\Web\HandleInertiaRequests;
use App\Support\DomainRegistry;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Testing\TestResponse;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Settings\SwitchesDomainsOff;
use Tests\TestCase;

/**
 * While Plans is switched off its pages and actions answer 404, its section on Chat's page and its navigation with
 * their counts are left out before their readers run, and other domains' pages are unchanged.
 */
final class DomainSwitchPagesTest extends TestCase
{
    use RefreshHookDatabase;
    use SwitchesDomainsOff;

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_pages_and_actions_of_a_switched_off_domain_answer_not_found_and_others_stay(): void
    {
        $plan = Plan::factory()->create(['title' => 'Kept', 'type' => PlanType::Build]);
        $this->switchDomainOff('plans');

        $this->inertia('/plans')->assertNotFound();
        $this->actingAs($this->journal->ownerUser())->post("/plans/{$plan->number}/start")->assertNotFound();
        $this->inertia('/rules')->assertOk();
    }

    /**
     * An Inertia request for the page, as the browser sends it after the first load.
     *
     * @param  array<string, string>  $headers
     */
    private function inertia(string $uri, array $headers = []): TestResponse
    {
        return $this->actingAs($this->journal->ownerUser())->get($uri, [
            'X-Inertia' => 'true',
            'X-Inertia-Version' => (string) $this->app->make(
                HandleInertiaRequests::class,
            )->version(Request::create($uri)),
            ...$headers,
        ]);
    }
}
