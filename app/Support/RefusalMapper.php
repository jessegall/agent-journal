<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Contracts\Refusals\RefusalMapper as RefusalMapperContract;
use App\Contracts\Refusals\RefusalRecovery;
use App\Enums\Engine\RefusalCode;
use App\Exceptions\ApiFailedUnexpectedly;
use App\Values\MappedRefusal;
use App\Values\RecoveryCall;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

/**
 * Turns a failure inside an MCP call into the refusal its caller is shown. A failure the journal did not name is
 * reported and shown only as a generic message with the call's correlation id; in the local and testing environments
 * the details also name the failure's class and message.
 */
final readonly class RefusalMapper implements RefusalMapperContract
{
    public function __construct(private ExceptionHandler $exceptions, private Application $app) {}

    /**
     * The failure as a caller is shown it; a failure nothing names is reported and shown only with its correlation id.
     */
    public function refusal(Throwable $failure, string $subject, string $correlationId): MappedRefusal
    {
        $recovery = $failure instanceof RefusalRecovery ? $failure->recovery() : null;

        return match (true) {
            $failure instanceof CodedRefusal => new MappedRefusal(
                $failure->refusalCode(),
                $failure->getMessage(),
                RecoveryCall::detailsOf($recovery),
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
            $failure instanceof AuthorizationException => new MappedRefusal(
                RefusalCode::Forbidden,
                $failure->getMessage(),
            ),
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
        $this->exceptions->report(ApiFailedUnexpectedly::for($subject, $correlationId, $failure));

        return new MappedRefusal(
            RefusalCode::Unavailable,
            "The journal could not complete this call. Correlation id: {$correlationId}.",
            $this->app->environment('local', 'testing')
                ? [
                    'exception' => $failure::class,
                    'cause' => $failure->getMessage(),
                ]
                : [],
        );
    }
}
