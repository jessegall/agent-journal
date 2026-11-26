<?php

declare(strict_types=1);

namespace App\Http\Responses;

use App\Actors\Contracts\CurrentActor;
use App\Bus\Contracts\CommandRefusal;
use App\Declarations\RegisteredLoader;
use App\Inboxes\Contracts\InboxMemberRoutes;
use App\Navigation\Contracts\ClientOwnerAvailability;
use App\Notifications\Contracts\Refusals\FieldRefusal;
use App\Support\ClientDeclarations;
use App\Values\InboxMemberAuthority;
use App\Web\Data\LoaderReplyData;
use App\Web\Enums\LoaderStatus;
use App\Web\Exceptions\LoaderInputUnreadable;
use App\Web\PageVisibility;
use App\Web\Values\LoaderInput;
use Illuminate\Contracts\Container\Container;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The answer to the loader call a partial reload names in its X-Journal-Loader header, as a shared prop: under the
 * loader's own prop, under loaderFailure for invalid input, or unavailable to the viewer, the same whatever the reason.
 * The checks before the reader run no query of it.
 */
final readonly class LoaderProps
{
    public const string HEADER = 'X-Journal-Loader';

    public const string FAILURE = 'loaderFailure';

    public function __construct(
        private ClientDeclarations $declarations,
        private ClientOwnerAvailability $owners,
        private CurrentActor $actors,
        private InboxMemberRoutes $memberRoutes,
        private PageVisibility $visibility,
        private Container $container,
    ) {}

    /**
     * Whether the request is a loader call, which every response to is kept out of caches.
     */
    public static function isCall(Request $request): bool
    {
        return $request->headers->has(self::HEADER);
    }

    /**
     * @return array<string, LoaderReplyData>
     *
     * @throws LoaderInputUnreadable when the call's input header cannot be read
     */
    public function of(Request $request): array
    {
        if (! self::isCall($request)) {
            return [];
        }

        $call = LoaderInput::fromHeader((string) $request->headers->get(LoaderInput::HEADER));

        $loader = $this->declarations->loader((string) $request->headers->get(self::HEADER))
            ->filter($this->isOpen(...));

        if ($loader->isEmpty()) {
            return [self::FAILURE => self::unavailable($call)];
        }

        return $this->answer($loader->get(), $call);
    }

    /**
     * Whether the viewer may call the loader: its owner is on, someone is signed in, an inbox member only on a key
     * opened to members, and its guarding page is visible to the viewer.
     */
    private function isOpen(RegisteredLoader $loader): bool
    {
        if (! $this->owners->isAvailable($loader->owner) || ! $this->actors->hasActor()) {
            return false;
        }

        if ($this->actors->authority() instanceof InboxMemberAuthority && ! $this->memberRoutes->admits($loader->key)) {
            return false;
        }

        return $loader->guardKey === null || $this->visibility->isVisible($loader->guardKey);
    }

    /**
     * @return array<string, LoaderReplyData>
     */
    private function answer(RegisteredLoader $loader, LoaderInput $call): array
    {
        try {
            $input = $loader->inputClass::validateAndCreate($call->input);
        } catch (ValidationException $invalid) {
            $errors = array_map(fn (array $messages) => (string) reset($messages), $invalid->errors());

            return [self::FAILURE => self::invalid($call, $errors)];
        }

        try {
            $value = $this->read($loader, $input);
        } catch (FieldRefusal $refusal) {
            return [self::FAILURE => self::invalid($call, [$refusal->field() => $refusal->fieldError()])];
        } catch (CommandRefusal|ModelNotFoundException|NotFoundHttpException) {
            return [self::FAILURE => self::unavailable($call)];
        }

        return [$loader->prop => LoaderReplyData::from([
            'token' => $call->token,
            'status' => LoaderStatus::Ok,
            'value' => $value,
            'errors' => new Optional(),
        ])];
    }

    private function read(RegisteredLoader $loader, Data $input): Data
    {
        return $this->container->make($loader->reader)($input);
    }

    /**
     * @param  array<string, string>  $errors  the message of each invalid field, by its name
     */
    private static function invalid(LoaderInput $call, array $errors): LoaderReplyData
    {
        return LoaderReplyData::from([
            'token' => $call->token,
            'status' => LoaderStatus::Invalid,
            'value' => new Optional(),
            'errors' => $errors,
        ]);
    }

    private static function unavailable(LoaderInput $call): LoaderReplyData
    {
        return LoaderReplyData::from([
            'token' => $call->token,
            'status' => LoaderStatus::Unavailable,
            'value' => new Optional(),
            'errors' => new Optional(),
        ]);
    }
}
