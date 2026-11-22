<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * A domain's declaration of an owner, an auto-assigner or a pool that the application cannot start with.
 */
final class AutoAssignmentDeclarationRefused extends LogicException
{
    public static function ownerRepeated(string $owner): self
    {
        return new self("The owner {$owner} registers its assignments twice; each owner registers once.");
    }

    public static function ownerUnknown(string $owner): self
    {
        return new self("The owner {$owner} declares assignments without registering itself first.");
    }

    public static function assignerRepeated(string $type): self
    {
        return new self("The record type {$type} is given an auto-assigner twice; one owner answers for it.");
    }

    public static function typeNotAssignable(string $type, string $owner): self
    {
        return new self(
            "The owner {$owner} declares auto-assignment for {$type}, but no domain registered it as assignable.",
        );
    }

    public static function assignerOfAnotherOwner(string $type, string $owner, string $recordOwner): self
    {
        return new self(
            "The owner {$owner} declares an auto-assigner for {$type}, which {$recordOwner} owns; only its owner may.",
        );
    }

    public static function poolRepeated(string $key): self
    {
        return new self("The pool {$key} is declared twice; one owner declares each pool key.");
    }

    public static function poolOfUnrelatedOwner(string $key, string $owner, string $recordOwner): self
    {
        return new self(
            "The owner {$owner} declares the pool {$key} of a type {$recordOwner} owns, and does not require it.",
        );
    }
}
