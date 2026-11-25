<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Enums\Agents\AccessType;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * The actor may not have the access; the message names the access and the kind of subject, never its content.
 */
final class ActorNotAllowed extends RuntimeException implements CommandRefusal
{
    public static function to(AccessType $access, string $subjectType): self
    {
        return new self("This actor may not {$access->value} this {$subjectType}.");
    }

    public static function withoutStoredAuthority(string $type, Throwable|null $previous = null): self
    {
        return new self(
            "A {$type} has no stored authority another actor's request could evaluate.",
            previous: $previous,
        );
    }

    public static function asNonOwner(): self
    {
        return new self('Only an owner of this journal may do this.');
    }

    public static function outsideTrustedEntry(string $authority): self
    {
        return new self("The journal acts under {$authority}, which is no trusted entry it knows.");
    }

    /**
     * The one place a Laravel gate's denial becomes the journal's refusal.
     */
    public static function fromDenial(AuthorizationException $denial, AccessType $access, string $subjectType): self
    {
        $refusal = self::to($access, $subjectType);

        return new self($refusal->getMessage(), 0, $denial);
    }

    /**
     * Every transport answers a refusal as forbidden: 403 over HTTP, with the safe message alone. A signed agent call
     * gets none here, so the journal answers it with the coded refusal every signed call answers with.
     */
    public function render(Request|null $request = null): JsonResponse|null
    {
        if ($request?->is('agent/*') === true) {
            return null;
        }

        return new JsonResponse(['message' => $this->getMessage()], Response::HTTP_FORBIDDEN);
    }
}
