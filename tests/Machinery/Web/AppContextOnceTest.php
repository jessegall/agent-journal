<?php

declare(strict_types=1);

namespace Tests\Machinery\Web;

use App\Http\Controllers\RenameAccountController;
use App\Http\Middleware\Web\HandleInertiaRequests;
use App\Web\AppContextFreshness;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Illuminate\Testing\TestResponse;
use Symfony\Component\HttpFoundation\Response;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The app context's slow-changing parts, the drivers, the installation and the accounts a start may run on, come once
 * with the first page and are kept by the browser; a route that changes them has them sent again on the page it leads
 * to.
 */
#[TestsMachinery(AppContextFreshness::class)]
final class AppContextOnceTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_app_context_comes_with_the_first_page_and_not_again_on_the_next_visit(): void
    {
        $this->journal->owner()->installProfiles();

        $firstPage = $this->visit();
        $firstPage->assertOk();
        $first = $firstPage->json('props');
        $kept = implode(',', array_keys((array) $firstPage->json('onceProps')));
        $next = $this->visit(['X-Inertia-Except-Once-Props' => $kept])->json('props');

        $this->assertSame(
            [true, true, false, false],
            [
                array_key_exists('drivers', $first),
                array_key_exists('startAccounts', $first),
                array_key_exists('drivers', $next),
                array_key_exists('startAccounts', $next),
            ],
        );
        $this->assertNotEmpty($first['startAccounts'][0]['defaultModel']);
    }

    public function test_after_a_route_that_changes_it_the_next_page_sends_it_again(): void
    {
        $this->journal->owner()->installProfiles();
        $kept = implode(',', array_keys((array) $this->visit()->json('onceProps')));

        $next = $this->withSession(['journal.app-context-stale' => true])
            ->visit(['X-Inertia-Except-Once-Props' => $kept])
            ->json('props');

        $this->assertArrayHasKey('drivers', $next);
    }

    public function test_a_route_marked_as_changing_the_app_context_makes_it_stale_now_and_on_the_next_page(): void
    {
        $request = Request::create('/accounts/rename', 'POST');
        $request->setLaravelSession($this->app->make('session.store'));
        $route = new Route('POST', '/accounts/rename', ['uses' => RenameAccountController::class]);
        $request->setRouteResolver(fn () => $route);
        $freshness = $this->app->make(AppContextFreshness::class);

        $freshness->noteChange($request);
        $next = Request::create('/');
        $next->setLaravelSession($this->app->make('session.store'));

        $this->assertSame([true, true], [$freshness->isStale($request), $freshness->isStale($next)]);
    }

    /**
     * @param  array<string, string>  $headers
     * @return TestResponse<Response>
     */
    private function visit(array $headers = []): TestResponse
    {
        return $this->actingAs($this->journal->ownerUser())->get('/', [
            'X-Inertia' => 'true',
            'X-Inertia-Version' => (string) $this->app->make(HandleInertiaRequests::class)->version(
                Request::create('/'),
            ),
            ...$headers,
        ]);
    }
}
