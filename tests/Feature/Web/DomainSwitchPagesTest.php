<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Http\Middleware\Web\HandleInertiaRequests;
use App\Settings\Models\SettingsRecord;
use App\Settings\Storage\EncodedToggle;
use App\Settings\Storage\EncodedValue;
use App\Ui\Declarations\RegisteredSection;
use App\Ui\Support\UiDeclarations;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\Resolvers\OpenPlansCount;
use Domain\Plans\Resolvers\WaitingPlansSection;
use Illuminate\Http\Request;
use Illuminate\Testing\TestResponse;
use Tests\Support\ActsAsOwner;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * While Plans is switched off its pages and actions answer 404, its section on Chat's page and its navigation with
 * their counts are left out before their readers run, and other domains' pages are unchanged.
 */
final class DomainSwitchPagesTest extends TestCase
{
    use ActsAsOwner;
    use RefreshHookDatabase;

    public function test_pages_and_actions_of_a_switched_off_domain_answer_not_found_and_others_stay(): void
    {
        $plan = Plan::factory()->create(['title' => 'Kept', 'type' => PlanType::Build]);
        $this->switchPlansOff();

        $this->inertia('/plans')->assertNotFound();
        $this->actingAs($this->owner)->post("/plans/{$plan->number}/start")->assertNotFound();
        $this->inertia('/rules')->assertOk();
    }

    public function test_navigation_and_counts_leave_out_a_switched_off_domain_without_reading_them(): void
    {
        $this->switchPlansOff();
        $countRead = false;
        $this->app->resolving(OpenPlansCount::class, function () use (&$countRead): void {
            $countRead = true;
        });

        $items = $this->inertia('/rules')->assertOk()->json('props.navigation.items');
        $counts = $this->inertia(
            '/rules',
            ['X-Inertia-Partial-Component' => 'rules/RulesWindow', 'X-Inertia-Partial-Data' => 'navigationCounts'],
        )->assertOk()->json('props.navigationCounts.counts');

        $this->assertNotContains('plans.list', array_column($items, 'key'));
        $this->assertContains('rules.list', array_column($items, 'key'));
        $this->assertArrayNotHasKey('plans.open', $counts);
        $this->assertFalse($countRead, 'The count of a switched-off domain was read.');
    }

    public function test_a_section_of_a_switched_off_domain_is_left_out_even_on_a_forged_partial_request(): void
    {
        $section = collect($this->app->make(UiDeclarations::class)->sections())->first(
            fn (RegisteredSection $found) => $found->owner->name === 'Plans',
        );
        $this->assertInstanceOf(RegisteredSection::class, $section);
        $this->switchPlansOff();
        $sectionRead = false;
        $this->app->resolving(WaitingPlansSection::class, function () use (&$sectionRead): void {
            $sectionRead = true;
        });

        $this->inertia('/chat', [
            'X-Inertia-Partial-Component' => $section->host->componentName(),
            'X-Inertia-Partial-Data' => $section->propName,
        ])->assertOk()->assertJsonMissingPath('props.'.$section->propName);

        $this->assertFalse($sectionRead, 'The section reader of a switched-off domain was built.');
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

    private function switchPlansOff(): void
    {
        SettingsRecord::insertIfAbsent('Core');
        $record = SettingsRecord::sharedRuntimeForOwner('Core')->get();
        $record->revise($record->document->withToggle(new EncodedToggle('domain_plans', EncodedValue::of(false))));
        $this->app->forgetScopedInstances();
    }
}
