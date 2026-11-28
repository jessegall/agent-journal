<?php

declare(strict_types=1);

namespace App\Web;

use App\Attributes\Web\RefreshesAppContext;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use ReflectionClass;
use ReflectionMethod;

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

        if ($class === null || ! class_exists($class)) {
            return false;
        }

        $controller = new ReflectionClass($class);
        $method = $route->getActionMethod();

        $onMethod = $controller->hasMethod($method)
            ? new ReflectionMethod($controller->getName(), $method)->getAttributes(RefreshesAppContext::class)
            : [];

        return $controller->getAttributes(RefreshesAppContext::class) !== [] || $onMethod !== [];
    }
}
