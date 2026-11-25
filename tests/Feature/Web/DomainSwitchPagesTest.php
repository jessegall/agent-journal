<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Declarations\RegisteredSection;
use App\Http\Middleware\Web\HandleInertiaRequests;
use App\Support\DomainRegistry;
use App\Support\UiDeclarations;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Http\Pages\Resolvers\WaitingPlansSection;
use Domain\Plans\Models\Plan;
use Domain\Plans\Resolvers\OpenPlansCount;
use Illuminate\Http\Request;
use Illuminate\Testing\TestResponse;
use Tests\Support\ActsAsOwner;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Settings\SwitchesDomainsOff;
use Tests\TestCase;

/**
 * While Plans is switched off its pages and actions answer 404, its section on Chat's page and its navigation with
 * their counts are left out before their readers run, and other domains' pages are unchanged.
 */
final class DomainSwitchPagesTest extends TestCase
{
    use ActsAsOwner;
    use RefreshHookDatabase;
    use SwitchesDomainsOff;

    private const string COUNT_READ = 'The count of a switched-off domain was read.';

    private const string SECTION_BUILT = 'The section reader of a switched-off domain was built.';

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }

    public function test_pages_and_actions_of_a_switched_off_domain_answer_not_found_and_others_stay(): void
    {
        $plan = Plan::factory()->create(['title' => 'Kept', 'type' => PlanType::Build]);
        $this->switchDomainOff('plans');

        $this->inertia('/plans')->assertNotFound();
        $this->actingAs($this->owner)->post("/plans/{$plan->number}/start")->assertNotFound();
        $this->inertia('/rules')->assertOk();
    }

    public function test_navigation_and_counts_leave_out_a_switched_off_domain_without_reading_them(): void
    {
        $this->switchDomainOff('plans');
        $countRead = false;
        $this->app->resolving(OpenPlansCount::class, function () use (&$countRead): void {
            $countRead = true;
        });

        $items = $this->inertia('/rules')->assertOk()->json('props.navigation.items');
        $counts = $this->inertia(
            '/rules',
            ['X-Inertia-Partial-Component' => 'layout/DeclaredLayout', 'X-Inertia-Partial-Data' => 'navigationCounts'],
        )->assertOk()->json('props.navigationCounts.counts');

        $this->assertNotContains('plans.list', array_column($items, 'key'));
        $this->assertContains('rules.list', array_column($items, 'key'));
        $this->assertArrayNotHasKey('plans.open', $counts);
        $this->assertFalse($countRead, self::COUNT_READ);
    }

    public function test_a_section_of_a_switched_off_domain_is_left_out_even_on_a_forged_partial_request(): void
    {
        $section = collect($this->app->make(UiDeclarations::class)->sections())->first(
            fn (RegisteredSection $found) => $found->owner->name === 'Plans',
        );
        $this->assertInstanceOf(RegisteredSection::class, $section);
        $this->switchDomainOff('plans');
        $sectionRead = false;
        $this->app->resolving(WaitingPlansSection::class, function () use (&$sectionRead): void {
            $sectionRead = true;
        });

        $this->inertia('/chat', [
            'X-Inertia-Partial-Component' => $section->host->componentName(),
            'X-Inertia-Partial-Data' => $section->propName,
        ])->assertOk()->assertJsonMissingPath('props.'.$section->propName);

        $this->assertFalse($sectionRead, self::SECTION_BUILT);
    }

    public function test_with_the_domain_on_its_page_and_navigation_show_again(): void
    {
        $this->inertia('/plans')->assertOk();
        $this->assertContains(
            'plans.list',
            array_column($this->inertia('/rules')->json('props.navigation.items'), 'key'),
        );
    }

    /**
     * An Inertia request for the page, as the browser sends it after the first load.
     *
     * @param  array<string, string>  $headers
     */
    private function inertia(string $uri, array $headers = []): TestResponse
    {
        return $this->actingAs($this->owner)->get($uri, [
            'X-Inertia' => 'true',
            'X-Inertia-Version' => (string) $this->app->make(
                HandleInertiaRequests::class,
            )->version(Request::create($uri)),
            ...$headers,
        ]);
    }
}
