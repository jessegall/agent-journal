<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Authorization\VisibilityCheck;
use App\Contracts\Navigation\PresentsLayout;
use App\Contracts\Navigation\WindowResults as WindowResultsContract;
use App\Contracts\Reflection\ReflectorFactory;
use App\Contracts\Refusals\CodedRefusal;
use App\Data\DeniedWindow;
use App\Data\DockOfferData;
use App\Data\FailedWindow;
use App\Data\ReadyWindow;
use App\Data\UnavailableWindow;
use App\Declarations\ResolverDefinition;
use App\Enums\RefusalCode;
use App\Exceptions\PrivateRecordMissing;
use App\Exceptions\ReaderDataMismatch;
use App\Support\Sources\Contracts\DockableWindow;
use App\Support\Sources\Contracts\DockOffers;
use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Validation\ValidationException;
use PhpOption\None;
use Psr\Log\LoggerInterface;
use Spatie\LaravelData\Data;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

/**
 * Turns one window, section or inspector into its result: denied without calling the reader when a check refuses or
 * the reader's record is private (missing and denied alike), ready with the reader's Data serialized inside this
 * boundary (an authorized empty read is ready, never a result of its own), or failed with a neutral message while the
 * error is logged with the key and the reader; in the local and testing environments the failed result also names the
 * error's class and message as its reason. A sign-in, CSRF, validation or redirect response still reaches the browser
 * as it is.
 */
final readonly class WindowResults implements WindowResultsContract
{
    public function __construct(
        private DockOffers $offers,
        private VisibilityChecks $visibility,
        private LoggerInterface $log,
        private ReflectorFactory $reflectors,
        private Application $app,
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
            $windowContent = $read();

            if ($this->reflectors->make($resolver->dataClass)->asInstance($windowContent)->isEmpty()) {
                throw ReaderDataMismatch::for($key, $resolver->dataClass, $windowContent::class);
            }

            $dockSource = $windowContent instanceof DockableWindow ? $windowContent->dockSource() : None::create();
            $offer = $dockSource->flatMap($this->offers->offerFor(...));

            // A layout result is sent as the layout it presents, never with its server-only facts.
            $shown = $windowContent instanceof PresentsLayout
                ? $windowContent->layout()->toArray()
                : $windowContent->toArray();

            return $offer->map(fn (DockOfferData $made) => ReadyWindow::offering($shown, $made))
                ->getOrCall(fn () => ReadyWindow::of($shown));
        } catch (
            AuthenticationException
            |TokenMismatchException
            |ValidationException
            |HttpResponseException
            |HttpExceptionInterface $control
        ) {
            throw $control;
        } catch (PrivateRecordMissing) {
            return DeniedWindow::make();
        } catch (CodedRefusal $refusal) {
            if ($refusal->refusalCode() !== RefusalCode::RecordUnavailable) {
                return $this->failed($key, $resolver, $refusal);
            }

            return UnavailableWindow::make();
        } catch (Throwable $failure) {
            return $this->failed($key, $resolver, $failure);
        }
    }

    /**
     * A neutral failure for the browser, with the error logged under the window's key and reader; where the
     * developer is reading (local and testing), the failure also names the error's class and message.
     */
    private function failed(string $key, ResolverDefinition $resolver, Throwable $failure): FailedWindow
    {
        $this->log->error(
            "The window {$key} failed: ".$failure::class.": {$failure->getMessage()}",
            ['key' => $key, 'reader' => $resolver->resolver, 'exception' => $failure],
        );

        if (! $this->app->environment('local', 'testing')) {
            return FailedWindow::make();
        }

        return FailedWindow::because($failure::class.": {$failure->getMessage()}");
    }
}
