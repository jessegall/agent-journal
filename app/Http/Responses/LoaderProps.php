<?php

declare(strict_types=1);

namespace App\Http\Responses;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Inboxes\InboxMemberRoutes;
use App\Contracts\Navigation\ClientOwnerAvailability;
use App\Contracts\Refusals\FieldRefusal;
use App\Data\Web\LoaderReplyData;
use App\Declarations\RegisteredLoader;
use App\Enums\Web\LoaderStatus;
use App\Exceptions\LoaderInputUnreadable;
use App\Support\ClientDeclarations;
use App\Support\Web\PageVisibility;
use App\Values\InboxMemberAuthority;
use App\Values\Web\LoaderInput;
use Illuminate\Contracts\Container\Container;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The answer to the one loader call a partial reload names in its X-Journal-Loader header, as a shared prop: under the
 * loader's own prop when it answers, under loaderFailure when its input is invalid, by its rules or by the reader's
 * refusal of a field, or it is unavailable to the viewer.
 * Unavailable is said the same way whatever the reason, and the checks before the reader run no query of it.
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
        } catch (CommandRefusal|ModelNotFoundException|NotFoundHttpException) {
            return [self::FAILURE => self::unavailable($call)];
        } catch (FieldRefusal $refusal) {
            return [self::FAILURE => self::invalid($call, $refusal->fieldErrors())];
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
