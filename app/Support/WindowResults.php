<?php

declare(strict_types=1);

namespace App\Support;

use App\Access\Contracts\VisibilityCheck;
use App\Bus\RequestKey;
use App\Contracts\Refusals\CodedRefusal;
use App\Data\Pages\DeniedWindow;
use App\Data\Pages\FailedWindow;
use App\Data\Pages\ReadyWindow;
use App\Declarations\ResolverDefinition;
use App\Engine\Enums\RefusalCode;
use App\Exceptions\PrivateRecordMissing;
use App\Exceptions\ReaderDataMismatch;
use App\Navigation\Contracts\PresentsLayout;
use App\Navigation\Contracts\RecordWindow;
use App\Navigation\Contracts\WindowOffers;
use App\Navigation\Contracts\WindowResults as WindowResultsContract;
use App\Navigation\Data\WindowOfferData;
use App\Reads\ReadMeter;
use App\Reflection\Contracts\ReflectorFactory;
use App\Web\Data\Pages\UnavailableWindow;
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
 * Turns one window, section or inspector into its result: denied without calling the reader when a check refuses or the
 * record is private, ready with the reader's Data, or failed with a neutral message while the error is logged. A
 * sign-in, CSRF, validation or redirect response reaches the browser as it is.
 */
final readonly class WindowResults implements WindowResultsContract
{
    public function __construct(
        private WindowOffers $offers,
        private VisibilityChecks $visibility,
        private LoggerInterface $log,
        private ReflectorFactory $reflectors,
        private Application $app,
        private RequestKey $requestKey,
        private ReadMeter $meter,
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
            $windowContent = $this->meter->measureApart("window {$key}", fn () => $this->requestKey->forPart($key, $read))
                ->measuredAnswer;

            if ($this->reflectors->make($resolver->dataClass)->asInstance($windowContent)->isEmpty()) {
                throw ReaderDataMismatch::for($key, $resolver->dataClass, $windowContent::class);
            }

            $record = $windowContent instanceof RecordWindow ? $windowContent->shownRecord() : None::create();
            $offer = $record->flatMap($this->offers->offerFor(...));

            // A layout result is sent as the layout it presents, never with its server-only facts.
            $shown = $windowContent instanceof PresentsLayout
                ? $windowContent->layout()->toArray()
                : $windowContent->toArray();

            return $offer->map(fn (WindowOfferData $made) => ReadyWindow::offering($shown, $made))
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
