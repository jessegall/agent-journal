<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Exceptions\CrossOwnerReadRefused;
use App\Actors\Exceptions\UserActorRequired;
use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Mcp\Exceptions\McpCallFailed;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Throwable;

/**
 * Turns a failure inside an MCP call into the refusal its caller is shown. A failure the journal did not name is
 * reported and shown only as a generic message with the call's correlation id.
 */
final readonly class RefusalMapper
{
    public function __construct(private ExceptionHandler $exceptions) {}

    public function refusal(Throwable $failure, string $subject, string $correlationId): Refusal
    {
        return match (true) {
            $failure instanceof CodedRefusal => new Refusal($failure->refusalCode(), $failure->getMessage()),
            $failure instanceof ValidationException => new Refusal(RefusalCode::InvalidInput, $failure->getMessage()),
            $failure instanceof AuthenticationException => new Refusal(RefusalCode::Unauthenticated, $failure->getMessage()),
            $failure instanceof AuthorizationException => new Refusal(RefusalCode::Forbidden, $failure->getMessage()),
            $failure instanceof UserActorRequired => new Refusal(RefusalCode::Forbidden, $failure->getMessage()),
            $failure instanceof CrossOwnerReadRefused => new Refusal(RefusalCode::Forbidden, $failure->getMessage()),
            $failure instanceof ActorNotAllowed => new Refusal(RefusalCode::Forbidden, $failure->getMessage()),
            default => $this->unexpected($failure, $subject, $correlationId),
        };
    }

    private function unexpected(Throwable $failure, string $subject, string $correlationId): Refusal
    {
        $this->exceptions->report(McpCallFailed::for($subject, $correlationId, $failure));

        return new Refusal(RefusalCode::Unavailable, "The journal could not complete this call. Correlation id: {$correlationId}.");
    }
}
