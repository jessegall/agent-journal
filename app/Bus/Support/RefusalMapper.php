<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Exceptions\CrossOwnerReadRefused;
use App\Actors\Exceptions\UserActorRequired;
use App\Bus\Contracts\CodedRefusal;
use App\Bus\Contracts\RefusalDetails;
use App\Bus\Contracts\RefusalMapper as RefusalMapperContract;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\CallFailedUnexpectedly;
use App\Bus\Values\MappedRefusal;
use App\Contracts\CommandRefusal;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

/**
 * Turns a failure inside an MCP call into the refusal its caller is shown. A failure the journal did not name is
 * reported and shown only as a generic message with the call's correlation id.
 */
final readonly class RefusalMapper implements RefusalMapperContract
{
    public function __construct(private ExceptionHandler $exceptions) {}

    /**
     * The failure as a caller is shown it; a failure nothing names is reported and shown only with its correlation id.
     */
    public function refusal(Throwable $failure, string $subject, string $correlationId): MappedRefusal
    {
        return match (true) {
            $failure instanceof CodedRefusal => new MappedRefusal(
                $failure->refusalCode(),
                $failure->getMessage(),
                $failure instanceof RefusalDetails ? $failure->refusalDetails() : [],
            ),
            $failure instanceof CommandRefusal => new MappedRefusal(RefusalCode::Forbidden, $failure->getMessage()),
            $failure instanceof ValidationException => new MappedRefusal(
                RefusalCode::InvalidInput,
                $failure->getMessage(),
                ['fields' => $failure->errors()],
            ),
            $failure instanceof AuthenticationException => new MappedRefusal(
                RefusalCode::Unauthenticated,
                $failure->getMessage(),
            ),
            $failure instanceof AuthorizationException,
            $failure instanceof UserActorRequired,
            $failure instanceof CrossOwnerReadRefused,
            $failure instanceof ActorNotAllowed => new MappedRefusal(RefusalCode::Forbidden, $failure->getMessage()),
            $failure instanceof ModelNotFoundException => new MappedRefusal(
                RefusalCode::RecordUnavailable,
                'The record does not exist or is not available to you.',
            ),
            $failure instanceof HttpExceptionInterface => $this->ofStatus($failure, $subject, $correlationId),
            default => $this->unexpected($failure, $subject, $correlationId),
        };
    }

    private function ofStatus(HttpExceptionInterface $failure, string $subject, string $correlationId): MappedRefusal
    {
        $message = $failure->getMessage();

        return match ($failure->getStatusCode()) {
            401 => new MappedRefusal(RefusalCode::Unauthenticated, $message),
            403 => new MappedRefusal(RefusalCode::Forbidden, $message),
            404 => new MappedRefusal(RefusalCode::RecordUnavailable, $message),
            426 => new MappedRefusal(RefusalCode::UnsupportedVersion, $message),
            429 => new MappedRefusal(RefusalCode::Busy, $message),
            default => $this->unexpected($failure, $subject, $correlationId),
        };
    }

    private function unexpected(Throwable $failure, string $subject, string $correlationId): MappedRefusal
    {
        $this->exceptions->report(CallFailedUnexpectedly::for($subject, $correlationId, $failure));

        return new MappedRefusal(
            RefusalCode::Unavailable,
            "The journal could not complete this call. Correlation id: {$correlationId}.",
        );
    }
}
