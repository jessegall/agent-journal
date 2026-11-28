<?php

declare(strict_types=1);

namespace App\Web;

use App\Attributes\Web\RefreshesAppContext;
use App\Support\Reflector;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;

/**
 * Whether the app context the browser keeps from its first page is out of date: a route marked as changing it went
 * before, in this request or the one its redirect leads to.
 */
final readonly class AppContextFreshness
{
    private const string STALE = 'journal.app-context-stale';

    /**
     * Notes a route that changes the app context, so the page its redirect leads to sends it again.
     */
    public function noteChange(Request $request): void
    {
        if ($this->changesAppContext($request) && $request->hasSession()) {
            $request->session()->flash(self::STALE, true);
        }
    }

    public function isStale(Request $request): bool
    {
        return $this->changesAppContext($request)
            || ($request->hasSession() && $request->session()->get(self::STALE) === true);
    }

    private function changesAppContext(Request $request): bool
    {
        $route = $request->route();

        if (! $route instanceof Route) {
            return false;
        }

        $class = $route->getControllerClass();

        if ($class === null) {
            return false;
        }

        $controller = Reflector::find($class)->getOrElse(null);

        if ($controller === null || ! $controller->isClass()) {
            return false;
        }

        $method = $route->getActionMethod();

        return $controller->hasAttribute(RefreshesAppContext::class)
            || ($controller->hasMethod($method) && $controller->method($method)->hasAttribute(RefreshesAppContext::class));
    }
}
