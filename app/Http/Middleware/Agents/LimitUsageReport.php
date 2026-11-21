<?php

declare(strict_types=1);

namespace App\Http\Middleware\Agents;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Refuses a usage report over 4 KiB before it is parsed: one report holds one measurement. It never logs the body.
 */
final readonly class LimitUsageReport
{
    public const int MOST_BYTES = 4096;

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (strlen($request->getContent()) > self::MOST_BYTES) {
            return new JsonResponse(
                ['message' => 'A usage report is at most '.self::MOST_BYTES.' bytes.'],
                Response::HTTP_REQUEST_ENTITY_TOO_LARGE,
            );
        }

        return $next($request);
    }
}
