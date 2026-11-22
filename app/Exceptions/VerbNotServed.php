<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A journal verb the server does not run for a connected machine: not a journal route, one that needs more than the
 * journal itself, a binding that is not the caller's own, a request id still running or given for another operation,
 * or a run whose outcome was lost.
 */
final class VerbNotServed extends RuntimeException implements CodedRefusal
{
    use RendersRefusal;

    private int $status = 403;

    public static function notAJournalVerb(string $name): self
    {
        return new self("{$name} is not a journal verb a connected machine runs on the server.");
    }

    public static function notYourBinding(string $bindingId): self
    {
        return new self("Binding {$bindingId} is not the binding of the calling agent.");
    }

    public static function providerSessionOnly(string $name): self
    {
        return new self("{$name} runs in a provider session for now; a signed-in shell runs journal verbs with the next release.");
    }

    public static function environmentUnassigned(string $bindingId): self
    {
        return new self(
            "Binding {$bindingId} works in no environment yet, so it runs no journal verb until one is assigned.",
        );
    }

    public static function notReconciled(string $bindingId): self
    {
        return new self(
            "Binding {$bindingId} runs journal verbs again once its relay has reported what became of its earlier "
            .'sessions.',
        );
    }

    public static function stillRunning(string $requestKey): self
    {
        $refusal = new self("Request {$requestKey} is still running; wait for it or cancel it.");
        $refusal->status = 409;

        return $refusal;
    }

    public static function anotherOperation(string $requestKey): self
    {
        $refusal = new self("Request {$requestKey} was given for another command; send this one under a new request id.");
        $refusal->status = 409;

        return $refusal;
    }

    public static function interrupted(string $requestKey): self
    {
        $refusal = new self(
            "Request {$requestKey} was interrupted when the server stopped running it, before its outcome was kept; "
            .'it is not run again.',
        );

        $refusal->status = 409;

        return $refusal;
    }

    public static function outcomeUnknown(string $requestKey): self
    {
        $refusal = new self(
            "The outcome of request {$requestKey} is unknown: the server stopped before it recorded the process; it is "
            .'not run again.',
        );

        $refusal->status = 409;

        return $refusal;
    }

    public function refusalCode(): RefusalCode
    {
        return $this->status === 409 ? RefusalCode::Busy : RefusalCode::Forbidden;
    }

    protected function status(): int
    {
        return $this->status;
    }
}
