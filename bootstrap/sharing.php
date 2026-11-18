<?php

declare(strict_types=1);

use App\Http\Middleware\Sharing\GuardShareRequest;
use App\Http\Middleware\Sharing\SecureShareResponse;
use App\Http\Responses\Sharing\SharedPageResponses;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Routing\RouteCollection;
use Illuminate\Routing\Router;
use Symfony\Component\HttpFoundation\Response;

/*
 * The share-only application: the same Core and domains, but after every provider has booted its routes are replaced
 * by the share content routes alone, with no session, cookie, sign-in, Inertia or CSRF, and every failure answered by a
 * fixed page.
 */
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(using: function (Application $app, Router $router): void {
        $app->booted(function () use ($router): void {
            $router->setRoutes(new RouteCollection);
            $router->group([], dirname(__DIR__).'/routes/sharing.php');
        });
    })
    ->withEvents(discover: false)
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->use([GuardShareRequest::class, SecureShareResponse::class]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Every failure, a refusal that renders itself included, ends as one of the fixed pages.
        $exceptions->respond(fn (Response $response, Throwable $failure) => SharedPageResponses::forFailure($failure));
    })->create();
