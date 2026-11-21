<?php

declare(strict_types=1);

namespace App\Connections\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use RuntimeException;

/**
 * A journal verb the server does not run for a connected machine: not a journal route, one that needs more than the
 * journal itself, a binding that is not the caller's own, or a request id still running.
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

    public static function notYetForShellUsers(string $name): self
    {
        return new self("{$name} runs in a provider session for now; a signed-in shell runs journal verbs with the next release.");
    }

    public static function stillRunning(string $requestId): self
    {
        $refusal = new self("Request {$requestId} is still running; wait for it or cancel it.");
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
