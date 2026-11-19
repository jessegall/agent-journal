<?php

declare(strict_types=1);

namespace App\Ui\Exceptions;

/**
 * A class a declaration names to read, check, count or run an action that is not of the type the declaration needs.
 */
final class UiResolverInvalid extends UiDeclarationError
{
    public static function notA(string $declaration, string $className, string $interface): self
    {
        return new self("{$declaration} names {$className}, which does not implement {$interface}.");
    }

    public static function manyRequests(string $declaration, string $resolver): self
    {
        return new self("{$declaration} names the resolver {$resolver}, whose constructor takes more than one form request; a resolver reads one request.");
    }

    public static function controllerNotOwned(string $declaration, string $controller): self
    {
        return new self("{$declaration} names the controller {$controller}, which is not an invokable class of the declaring domain.");
    }
}
