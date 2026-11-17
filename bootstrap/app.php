<?php

declare(strict_types=1);

use App\Core\Agents\Http\Middleware\AuthenticateAgent;
use App\Domain\Access\Http\Middleware\AuthenticatePerson;
use App\Domain\Web\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Routing\Middleware\SubstituteBindings;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->prependToPriorityList(before: SubstituteBindings::class, prepend: AuthenticateAgent::class);
        $middleware->prependToPriorityList(before: SubstituteBindings::class, prepend: AuthenticatePerson::class);
        $middleware->alias(['journal.person' => AuthenticatePerson::class]);
        // A message body is kept exactly as typed, its leading and trailing spaces and newlines included.
        $middleware->trimStrings(except: ['body']);
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
