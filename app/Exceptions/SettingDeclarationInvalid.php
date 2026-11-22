<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;
use Throwable;

/**
 * A setting or group declared wrongly; the message names the key, never a value.
 */
final class SettingDeclarationInvalid extends LogicException
{
    public static function badKey(string $key, int $longest): self
    {
        return new self(
            sprintf(
                'The setting key %s is not lowercase letters, digits and underscores starting with a letter, at most %s characters.',
                $key,
                $longest,
            ),
        );
    }

    public static function emptyLabel(string $key): self
    {
        return new self("The setting {$key} has an empty label.");
    }

    public static function labelTooLong(string $key, int $longest): self
    {
        return new self("The label of setting {$key} is longer than {$longest} characters.");
    }

    public static function badLengths(string $key, int $longest): self
    {
        return new self(
            "The setting {$key} declares lengths outside 0 to {$longest} bytes, or a shortest above its longest.",
        );
    }

    public static function defaultOutOfBounds(string $key, Throwable|null $previous = null): self
    {
        return new self("The default of setting {$key} is outside the values it accepts.", previous: $previous);
    }

    public static function coreNotFirst(): self
    {
        return new self('The settings of Core must be registered first, under the name Core.');
    }

    public static function ownerTwice(string $owner): self
    {
        return new self(
            "The settings owner {$owner} is registered twice, or under a name that differs from another only in case.",
        );
    }

    public static function definitionTwice(string $owner, string $definition): self
    {
        return new self("{$owner} registers {$definition}, which another owner already registered.");
    }

    public static function groupTwice(string $owner, string $key): self
    {
        return new self("{$owner} declares the settings group {$key} twice.");
    }

    public static function settingTwice(string $owner, string $key): self
    {
        return new self("{$owner} declares the setting {$key} twice, in one group or across two.");
    }

    public static function tooManyGroups(string $owner, int $limit): self
    {
        return new self("{$owner} declares more than {$limit} settings groups.");
    }

    public static function tooManySettings(string $owner, int $limit): self
    {
        return new self("{$owner} declares more than {$limit} settings.");
    }

    public static function badBounds(string $key): self
    {
        return new self(
            "The setting {$key} declares a minimum above its maximum, or a bound past the largest exact number.",
        );
    }

    public static function badDigits(string $key, int $mostDigits, int $mostFractionalDigits): self
    {
        return new self(
            sprintf(
                'The setting %s declares digits outside 1 to %s, fractional digits outside 0 to %s, or more fractional digits than digits.',
                $key,
                $mostDigits,
                $mostFractionalDigits,
            ),
        );
    }

    public static function badChoiceLabel(int $longest): self
    {
        return new self("A choice label is empty or longer than {$longest} characters.");
    }

    public static function badOptionCount(string $key, int $most): self
    {
        return new self("The setting {$key} declares no options, or more than {$most}.");
    }

    public static function optionTwice(string $key): self
    {
        return new self("The setting {$key} declares one option value twice.");
    }

    public static function defaultNotAnOption(string $key): self
    {
        return new self("The default of setting {$key} is not one of its options.");
    }

    public static function notABackedEnum(string $key): self
    {
        return new self("The setting {$key} names an enum without backing values.");
    }

    public static function mixedOptionTypes(string $key): self
    {
        return new self("The setting {$key} mixes text and whole-number options, or its default is of the other type.");
    }
}
