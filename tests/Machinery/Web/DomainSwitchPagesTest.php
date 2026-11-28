<?php

declare(strict_types=1);

namespace Tests\Machinery\Web;

use App\CorePages;
use App\Http\Middleware\Web\HandleInertiaRequests;
use App\Support\ClientDeclarations;
use App\Support\DomainRegistry;
use App\Terminals\Data\TerminalWindowData;
use App\Web\Creation\Exceptions\MissingBuilder;
use App\Web\Creation\PageFactory;
use App\Web\Creation\WindowFactory;
use Domain\Plans\Data\PlansPaneData;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Http\Windows\PlansWindowBuilder;
use Domain\Plans\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Modules\Notes\Data\NotesPageData;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Settings\SwitchesDomainsOff;
use Tests\TestCase;

/**
 * While Plans is switched off its pages and actions answer 404, its section on Chat's page and its navigation with
 * their counts are left out before their readers run, and other domains' pages are unchanged.
 */
#[TestsMachinery(DomainRegistry::class)]
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

        $this->journal->installProfiles()->owner();
    }

    public function test_pages_and_actions_of_a_switched_off_domain_answer_not_found_and_others_stay(): void
    {
        $plan = Plan::factory()->create(['title' => 'Kept', 'type' => PlanType::Build]);
        $this->switchDomainOff('plans');

        $this->inertia('/plans')->assertNotFound();
        $this->actingAs($this->journal->ownerUser())->post("/plans/{$plan->number}/start")->assertNotFound();
        $this->inertia('/rules')->assertOk();
    }

    public function test_installed_owners_register_exact_pairs_once_from_their_declarations(): void
    {
        $declarations = $this->app->make(ClientDeclarations::class);
        $pages = $this->app->make(PageFactory::class);
        $windows = $this->app->make(WindowFactory::class);
        $windowFiles = [];

        foreach ($declarations->owners() as $owner) {
            foreach ($owner->pages as $definition) {
                $registered = $declarations->page($owner->fullKey('page', $definition->key));
                $this->assertSame($definition->surface, $registered->surface);
                $this->assertSame($definition->surface->builder, $pages->builderFor($definition->surface->type));
                $this->assertFalse($windows->hasBuilderFor($definition->surface->type));

                if ($definition->window === null) {
                    continue;
                }

                $this->assertSame($definition->window, $registered->window);
                $this->assertSame($definition->window->builder, $windows->builderFor($definition->window->type));
                $this->assertFalse($pages->hasBuilderFor($definition->window->type));
                $this->assertStringStartsWith($owner->pageFolder().'/', $registered->windowFile);
                $this->assertNotContains($registered->windowFile, $windowFiles);
                $windowFiles[] = $registered->windowFile;
            }
        }

        $this->assertCount(10, $windowFiles);
        $login = CorePages::login();
        $this->assertSame($login->builder, $pages->builderFor($login->type));
        $this->assertFalse($declarations->declares('login'));
        $this->assertFalse($windows->hasBuilderFor($login->type));
    }

    public function test_a_page_only_type_refuses_window_creation_by_its_exact_name(): void
    {
        $this->expectExceptionObject(MissingBuilder::forType('window', TerminalWindowData::class));

        $this->app->make(WindowFactory::class)->create(TerminalWindowData::class, Request::create('/'));
    }

    public function test_a_disabled_pane_does_not_resolve_its_builder_when_named_in_a_partial(): void
    {
        $resolved = 0;
        $this->app->resolving(PlansWindowBuilder::class, function () use (&$resolved): void {
            $resolved++;
        });
        $this->switchDomainOff('plans');

        $this->inertia('/', [
            'X-Inertia-Partial-Component' => 'web/Home',
            'X-Inertia-Partial-Data' => 'window_plans_list',
        ])->assertOk()->assertJsonMissingPath('props.window_plans_list');
        $this->assertSame(0, $resolved);
        $this->assertSame(
            PlansWindowBuilder::class,
            $this->app->make(WindowFactory::class)->builderFor(PlansPaneData::class),
        );
    }

    public function test_unbooted_modules_have_no_registration_in_either_factory(): void
    {
        $pages = $this->app->make(PageFactory::class);
        $windows = $this->app->make(WindowFactory::class);

        $this->assertFalse($this->app->make(DomainRegistry::class)->has('Notes'));
        $this->assertFalse($pages->hasBuilderFor(NotesPageData::class));
        $this->assertFalse($windows->hasBuilderFor(NotesPageData::class));
        $this->assertSame($pages, $this->app->make(PageFactory::class));
        $this->assertSame($windows, $this->app->make(WindowFactory::class));
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
