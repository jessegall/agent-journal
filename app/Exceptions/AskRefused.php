<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use App\Values\SubjectType;
use RuntimeException;

final class AskRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public const int BODY_LIMIT = 16000;

    public static function assertValidSubmission(string $body, string $key): void
    {
        self::assertValidBody($body);

        if (preg_match('/^[a-zA-Z0-9-]{1,128}$/D', $key) !== 1) {
            throw self::invalidKey();
        }
    }

    public static function assertValidBody(string $body): void
    {
        if ($body === '' || strlen($body) > self::BODY_LIMIT) {
            throw self::invalidBody();
        }
    }

    public static function invalidKey(): self
    {
        return new self('An ask submission needs a valid request key.');
    }

    public static function invalidBody(): self
    {
        return new self('Ask text must have between 1 and '.self::BODY_LIMIT.' bytes.');
    }

    public static function openLimit(int $limit): self
    {
        return new self("You already have {$limit} open asks.");
    }

    public static function onlyOwnerAnswersLate(): self
    {
        return new self('Only the owner can add a late answer to an unanswered ask.');
    }

    public static function cannotWithdraw(): self
    {
        return new self('Only the requester can withdraw an open ask.');
    }

    public static function typeRepeated(string $type): self
    {
        return new self("The ask type {$type} is registered twice.");
    }

    public static function workRequired(SubjectType $type): self
    {
        return new self("The {$type->key} ask needs a visible work record.");
    }

    public static function submissionChanged(): self
    {
        return new self('The key belongs to another ask submission.');
    }

    public static function routeChanged(): self
    {
        return new self('The ask has moved since this route was read.');
    }

    public static function wrongOperation(): self
    {
        return new self('The operation does not answer this ask type.');
    }

    public static function operationDenied(string $reason): self
    {
        return new self($reason);
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Forbidden;
    }

    public static function onlyOwnerResolvesMerges(): self
    {
        return new self('Only the owner states how an uncertain merge ended.');
    }

    public static function mergeNotUncertain(string $attemptId): self
    {
        return new self("Merge attempt {$attemptId} is not uncertain, or the stated outcome is no ending; nothing changed.");
    }

    public static function onlyOwnerClosesChains(): self
    {
        return new self('Only the owner closes the chain of reviewed work.');
    }
}
