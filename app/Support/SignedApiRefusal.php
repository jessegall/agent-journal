<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Container\Container;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

/**
 * Renders a failure on a signed agent route the way MCP shows it: a refusal code, a safe message and its details. A
 * refusal that renders itself, and a failure that carries its own response, never reach here; a failure off the agent
 * routes is left to the framework.
 */
final class SignedApiRefusal
{
    public static function render(Throwable $failure, Request $request): JsonResponse|null
    {
        if (! $request->is('agent/*') || $failure instanceof HttpResponseException) {
            return null;
        }

        $mapper = Container::getInstance()->make(RefusalMapper::class);
        $refusal = $mapper->refusal($failure, $request->path(), Str::uuid()->toString());

        $headers = $failure instanceof HttpExceptionInterface ? $failure->getHeaders() : [];

        return new JsonResponse($refusal->toArray(), $refusal->code->status(), $headers);
    }
}
