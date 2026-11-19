<?php

declare(strict_types=1);

namespace App\Web\Support;

use App\Ui\Contracts\VisibilityCheck;
use App\Ui\Declarations\ResolverDefinition;
use App\Web\Contracts\ReadsWindowResults;
use App\Web\Data\DeniedWindow;
use App\Web\Data\FailedWindow;
use App\Web\Data\ReadyWindow;
use App\Web\Exceptions\ReaderDataMismatch;
use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Validation\ValidationException;
use Psr\Log\LoggerInterface;
use Spatie\LaravelData\Data;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

/**
 * Turns one window, section or inspector into its result: denied without calling the reader when a check refuses,
 * ready with the reader's Data serialized inside this boundary, or failed with a neutral message while the error is
 * logged with the key. A sign-in, CSRF, validation or redirect response still reaches the browser as it is.
 */
final readonly class WindowResults implements ReadsWindowResults
{
    public function __construct(
        private VisibilityChecks $visibility,
        private LoggerInterface $log,
    ) {}

    /**
     * @param  list<class-string<VisibilityCheck>>  $checks
     * @param  Closure(): Data  $read
     */
    public function result(string $key, array $checks, ResolverDefinition $resolver, Closure $read): Data
    {
        if (! $this->visibility->allow($checks)) {
            return DeniedWindow::make();
        }

        try {
            $data = $read();

            if (! $data instanceof $resolver->dataClass) {
                throw ReaderDataMismatch::for($key, $resolver->dataClass, $data::class);
            }

            return ReadyWindow::of($data->toArray());
        } catch (
            AuthenticationException
            |TokenMismatchException
            |ValidationException
            |HttpResponseException
            |HttpExceptionInterface $control
        ) {
            throw $control;
        } catch (Throwable $failure) {
            $this->log->error(
                "The window {$key} failed: {$failure->getMessage()}",
                ['key' => $key, 'exception' => $failure],
            );

            return FailedWindow::make();
        }
    }
}
