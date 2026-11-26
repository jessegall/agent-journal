<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Data\Web\AppContextData;
use App\Declarations\RegisteredLoader;
use App\Declarations\RegisteredPage;
use App\Declarations\RegisteredSection;
use App\Http\Middleware\Web\HandleInertiaRequests;
use App\Http\Responses\LoaderProps;
use App\Support\ClientDeclarations;
use App\Support\ReflectedParameter;
use App\Support\Reflector;
use App\Support\Web\PageProps;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tests\Fixtures\PagePropsOwners\SharingAnUnownedProp;

/**
 * Every prop the Inertia middleware shares has an owner: Inertia's own, a field of the app context, a declared page's
 * prop or a loader's answer. A new shared prop goes into one of them, never straight into share().
 */
final class PagePropsOwnersTest extends TestCase
{
    private const string HOW_TO_FIX
        = 'Share it as a field of AppContextData, a declared page prop or a loader, never straight from share().';

    public function test_every_shared_prop_has_an_owner(): void
    {
        $this->journal->owner();

        $this->assertSame([], $this->unownedKeys(HandleInertiaRequests::class), self::HOW_TO_FIX);
    }

    public function test_a_shared_prop_without_an_owner_is_named(): void
    {
        $this->journal->owner();

        $this->assertSame([SharingAnUnownedProp::UNOWNED], $this->unownedKeys(SharingAnUnownedProp::class));
    }

    /**
     * The keys the middleware shares on a page visit that no owner declares.
     *
     * @param  class-string<HandleInertiaRequests>  $middleware
     * @return list<string>
     */
    private function unownedKeys(string $middleware): array
    {
        $request = Request::create('/');
        $request->setLaravelSession($this->app->make('session.store'));
        $shared = array_filter(array_keys($this->app->make($middleware)->share($request)), is_string(...));

        return array_values(array_diff($shared, $this->ownedKeys($request)));
    }

    /**
     * Inertia's own keys, the app context's fields, the props of the declared pages and the loader answers.
     *
     * @return list<string>
     */
    private function ownedKeys(Request $request): array
    {
        $declarations = $this->app->make(ClientDeclarations::class);
        $inertia = new class extends Middleware {};
        $context = Reflector::of(AppContextData::class)->constructor()->get()->parameters();

        return [
            ...array_keys($inertia->share($request)),
            ...array_map(fn (ReflectedParameter $field) => $field->name(), $context),
            PageProps::TITLE,
            PageProps::PAGE,
            PageProps::INSPECTOR,
            ...array_map(fn (RegisteredPage $page) => $page->propName, $declarations->pages()),
            ...array_map(fn (RegisteredSection $section) => $section->propName, $declarations->sections()),
            ...array_map(fn (RegisteredLoader $loader) => $loader->prop, $declarations->loaders()),
            LoaderProps::FAILURE,
        ];
    }
}
