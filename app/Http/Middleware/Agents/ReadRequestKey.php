<?php

declare(strict_types=1);

namespace App\Http\Middleware\Agents;

use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Exceptions\KeyedWriteWithoutReceipt;
use App\AgentRequests\Support\CallDeclaration;
use App\AgentRequests\Support\CallRoutes;
use App\Agents\Support\ReadGrant;
use App\Agents\Values\ReadRequest;
use App\Bus\Support\RequestKey;
use Closure;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

/**
 * Reads the request_key of a signed agent call's JSON body into the request's key, so the write it carries is
 * receipted under it. The key travels inside the signed body, so the call's signature covers it.
 */
final readonly class ReadRequestKey
{
    private const string FIELD = 'request_key';

    public function __construct(
        private RequestKey $key,
        private ExceptionHandler $failures,
        private Application $app,
        private ReadGrant $reads,
    ) {}

    /**
     * Reads the call's declaration on a route registered from one: undeclared body fields are refused, a keyed write
     * needs its key, and only a write the bus keeps the receipt of hands the key to the bus. Older routes hand any
     * key they carry.
     *
     * @param  Closure(Request): Response  $next
     *
     * @throws ValidationException
     */
    public function handle(Request $request, Closure $next): Response
    {
        $call = $request->route()?->defaults[CallRoutes::CALL_DEFAULT] ?? null;
        $declaration = is_string($call) && class_exists($call) ? CallDeclaration::of($call) : null;

        if ($declaration !== null) {
            self::requireDeclaredFields($request, $declaration);

            if ($declaration->endpoint->effect === CallEffect::Read) {
                $this->reads->requireAllowed(self::readRequest($declaration, $request));
            }
        }

        $handsKey = $declaration === null || $declaration->endpoint->receipt === ReceiptOwner::CommandBus;

        if ($handsKey && $request->filled(self::FIELD)) {
            $this->key->set($request->string(self::FIELD)->value());
        }

        try {
            $response = $next($request);

            if ($response->isSuccessful()) {
                $this->guardReceipt($declaration);
            }

            return self::answeredOk($response, $declaration);
        } finally {
            $this->key->forget();
        }
    }

    private static function readRequest(CallDeclaration $declaration, Request $request): ReadRequest
    {
        $path = $declaration->endpoint->path;
        $name = match ($path) {
            'communication/show' => 'messages_read',
            'communication/history' => 'inbox_history',
            'communication/counts' => 'inbox_counts',
            default => Str::replace(['/', '-'], '_', $path),
        };
        $arguments = $name === 'messages_read' && $request->filled('message_id')
            ? ['message_id' => $request->string('message_id')->value()]
            : [];

        return new ReadRequest($name, arguments: $arguments);
    }

    /**
     * @throws ValidationException
     */
    private static function requireDeclaredFields(Request $request, CallDeclaration $declaration): void
    {
        $undeclared = $declaration->undeclared(array_values(array_map(strval(...), $request->keys())));

        if ($undeclared !== []) {
            throw ValidationException::withMessages(array_fill_keys($undeclared, 'is not a field of this call'));
        }

        if ($declaration->needsReceipt() && ! $request->filled(self::FIELD)) {
            throw ValidationException::withMessages([self::FIELD => 'is required for a keyed write']);
        }
    }

    /**
     * A write the bus keeps the receipt of that took none could apply twice on a retry: tests fail on it, production
     * reports it.
     */
    private function guardReceipt(CallDeclaration|null $declaration): void
    {
        if ($declaration === null || $declaration->endpoint->receipt !== ReceiptOwner::CommandBus) {
            return;
        }

        if ($this->key->wasReceiptTaken()) {
            return;
        }

        $failure = KeyedWriteWithoutReceipt::for($declaration->call);

        if ($this->app->runningUnitTests()) {
            throw $failure;
        }

        $this->failures->report($failure);
    }

    /**
     * A signed call answers 200 on success, read or write: its answer is the call's result, not a created resource,
     * though Data answers a POST with 201.
     */
    private static function answeredOk(Response $response, CallDeclaration|null $declaration): Response
    {
        if ($declaration !== null && $response->getStatusCode() === Response::HTTP_CREATED) {
            $response->setStatusCode(Response::HTTP_OK);
        }

        return $response;
    }
}
