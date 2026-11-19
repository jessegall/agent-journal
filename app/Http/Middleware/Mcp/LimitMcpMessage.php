<?php

declare(strict_types=1);

namespace App\Http\Middleware\Mcp;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Refuses an MCP message over 256 KiB or nested deeper than 32 levels before the package parses it. It never logs the body.
 */
final readonly class LimitMcpMessage
{
    public const int MAX_BYTES = 262144;

    public const int MAX_DEPTH = 32;

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $body = $request->getContent();

        if (strlen($body) > self::MAX_BYTES) {
            return new JsonResponse(
                ['message' => 'The message is larger than '.self::MAX_BYTES.' bytes.'],
                Response::HTTP_REQUEST_ENTITY_TOO_LARGE,
            );
        }

        json_decode($body, true, self::MAX_DEPTH);

        if (json_last_error() === JSON_ERROR_DEPTH) {
            return new JsonResponse(
                ['message' => 'The message is nested deeper than '.self::MAX_DEPTH.' levels.'],
                Response::HTTP_BAD_REQUEST,
            );
        }

        return $next($request);
    }
}
