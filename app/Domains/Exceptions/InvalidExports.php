<?php

declare(strict_types=1);

namespace App\Domains\Exceptions;

/**
 * A list of exports the application refuses to start with, naming the owner and the entry at fault.
 */
final class InvalidExports extends DomainDeclarationError
{
    public static function missing(string $owner, string $exportGroup, string $name): self
    {
        return new self("{$owner} exports {$name} under {$exportGroup}, but no such class exists; fix the name or remove it.");
    }

    public static function outsideOwner(string $owner, string $name, string $namespace): self
    {
        return new self(
            "{$owner} exports {$name}, which is not in its own namespace {$namespace}; export only its own types.",
        );
    }

    public static function notAnEvent(string $owner, string $name): self
    {
        return new self(
            sprintf(
                '%s exports %s under events, but it is not a final class implementing App\\Contracts\\Event; move it to the list it belongs in.',
                $owner,
                $name,
            ),
        );
    }

    public static function eventIsACommand(string $owner, string $name): self
    {
        return new self("{$owner} exports {$name} under events, but it is a command; export it under commands.");
    }

    public static function notAnInterface(string $owner, string $name): self
    {
        return new self(
            sprintf(
                '%s exports %s under contracts, but it is not an interface; export its interface, or move it to values.',
                $owner,
                $name,
            ),
        );
    }

    public static function notACommand(string $owner, string $name): self
    {
        return new self(
            sprintf(
                '%s exports %s under commands, but it is not a final class implementing App\\Bus\\Contracts\\Command; move it to the list it belongs in.',
                $owner,
                $name,
            ),
        );
    }

    public static function notAnException(string $owner, string $name): self
    {
        return new self(
            sprintf(
                '%s exports %s under exceptions, but it is not a Throwable in an Exceptions namespace; move it there or to the list it belongs in.',
                $owner,
                $name,
            ),
        );
    }

    public static function notAValue(string $owner, string $name, string $reason): self
    {
        return new self("{$owner} exports {$name} under values, but {$reason}.");
    }

    public static function supportOutsideCore(string $owner, string $name): self
    {
        return new self(
            sprintf(
                '%s exports %s under support, which only Core may use; export it under the list its type belongs in.',
                $owner,
                $name,
            ),
        );
    }

    public static function unknownSupport(string $name): self
    {
        return new self(
            sprintf(
                'Core exports %s under support, which is not one of its listed support types; give it an interface or move it to values.',
                $name,
            ),
        );
    }
}
