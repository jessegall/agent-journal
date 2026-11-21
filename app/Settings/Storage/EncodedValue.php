<?php

declare(strict_types=1);

namespace App\Settings\Storage;

use App\Contracts\Attributes\DecodesAnyJson;
use JsonSerializable;
use PhpOption\None;
use PhpOption\Option;

/**
 * One stored setting or toggle value as its JSON text, kept whatever JSON it holds so that a value no declaration
 * accepts still stays exactly as it was stored. Only app/Settings reads what is inside.
 *
 * @internal
 */
final readonly class EncodedValue implements JsonSerializable
{
    public const int JSON_FLAGS = JSON_UNESCAPED_SLASHES
        | JSON_UNESCAPED_UNICODE
        | JSON_PRESERVE_ZERO_FRACTION
        | JSON_THROW_ON_ERROR;

    private function __construct(private string $json) {}

    /**
     * A value as json_decode gives it with objects kept as objects, so an empty object stays an empty object.
     */
    public static function of(mixed $decoded): self
    {
        return new self(json_encode($decoded, self::JSON_FLAGS));
    }

    public function equals(self $other): bool
    {
        return $this->json === $other->json;
    }

    /**
     * The value when it is a JSON string.
     *
     * @return Option<string>
     */
    public function string(): Option
    {
        $decoded = $this->jsonSerialize();

        return is_string($decoded) ? Option::fromValue($decoded) : None::create();
    }

    /**
     * The value when it is a JSON true or false.
     *
     * @return Option<bool>
     */
    public function boolean(): Option
    {
        $decoded = $this->jsonSerialize();

        return is_bool($decoded) ? Option::fromValue($decoded) : None::create();
    }

    /**
     * The value when it is a JSON number written without a fraction or exponent that fits an int.
     *
     * @return Option<int>
     */
    public function integer(): Option
    {
        $decoded = $this->jsonSerialize();

        return is_int($decoded) ? Option::fromValue($decoded) : None::create();
    }

    /**
     * The stored value decoded, which may be any JSON type, so it has no fixed shape for a Data class to hold.
     */
    #[DecodesAnyJson]
    public function jsonSerialize(): mixed
    {
        return json_decode($this->json, false, 512, JSON_THROW_ON_ERROR);
    }
}
