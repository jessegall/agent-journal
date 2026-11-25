<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * A class a declaration names to read, check, count or run an action that is not of the type the declaration needs.
 */
final class ClientResolverInvalid extends ClientDeclarationError
{
    public static function notA(string $declaration, string $className, string $interface): self
    {
        return new self("{$declaration} names {$className}, which does not implement {$interface}.");
    }

    public static function manyRequests(string $declaration, string $resolver): self
    {
        return new self(
            sprintf(
                '%s names the resolver %s, whose constructor takes more than one form request; a resolver reads one '
                    .'request.',
                $declaration,
                $resolver,
            ),
        );
    }

    public static function loaderNotOwned(string $declaration, string $reader): self
    {
        return new self(
            sprintf(
                '%s names the loader reader %s, which is not an invokable class of the declaring domain.',
                $declaration,
                $reader,
            ),
        );
    }

    public static function loaderShape(string $declaration, string $reader): self
    {
        return new self(
            sprintf(
                '%s names the loader reader %s, whose __invoke must take exactly one Data and return a Data.',
                $declaration,
                $reader,
            ),
        );
    }

    public static function loaderTypeNotOwned(string $declaration, string $dataClass, string $owner): self
    {
        return new self(
            sprintf(
                '%s reads or answers %s, which is not among the types %s declares.',
                $declaration,
                $dataClass,
                $owner,
            ),
        );
    }

    public static function controllerNotOwned(string $declaration, string $controller): self
    {
        return new self(
            sprintf(
                '%s names the controller %s, which is not an invokable class of the declaring domain.',
                $declaration,
                $controller,
            ),
        );
    }
}
