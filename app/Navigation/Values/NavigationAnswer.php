<?php

declare(strict_types=1);

namespace App\Navigation\Values;

use App\Navigation\Enums\NavigationKey;
use App\Navigation\Exceptions\NavigationAnswerRefused;

/**
 * What the main agent sends in one round: exactly one of named keys, the label of an entry to choose, the label of
 * the entry it saw highlighted to confirm, or the name of a goal parameter whose value is typed. No free text and no
 * control key but esc ever travels.
 */
final readonly class NavigationAnswer
{
    /**
     * The longest label an answer may name.
     */
    private const int LABEL_CHARACTER_LIMIT = 200;

    /**
     * @param  list<NavigationKey>  $keys
     */
    private function __construct(
        public array $keys = [],
        public string|null $choose = null,
        public string|null $confirm = null,
        public string|null $typeParameter = null,
    ) {}

    /**
     * @param  list<string>  $names
     *
     * @throws NavigationAnswerRefused
     */
    public static function keys(array $names): self
    {
        if ($names === []) {
            throw NavigationAnswerRefused::noKeys();
        }

        return new self(keys: array_map(
            fn (string $name) => NavigationKey::tryFrom($name) ?? throw NavigationAnswerRefused::keyNotAllowed($name),
            $names,
        ));
    }

    /**
     * @throws NavigationAnswerRefused
     */
    public static function choose(string $label): self
    {
        return new self(choose: self::label($label));
    }

    /**
     * @throws NavigationAnswerRefused
     */
    public static function confirm(string $label): self
    {
        return new self(confirm: self::label($label));
    }

    /**
     * Types the value of one of the request's goal parameters, named; the handler checks the request has it.
     */
    public static function typeParameter(string $name): self
    {
        return new self(typeParameter: $name);
    }

    /**
     * @throws NavigationAnswerRefused
     */
    private static function label(string $label): string
    {
        if (trim($label) === '' || mb_strlen($label) > self::LABEL_CHARACTER_LIMIT) {
            throw NavigationAnswerRefused::labelNotAllowed(self::LABEL_CHARACTER_LIMIT);
        }

        return $label;
    }
}
