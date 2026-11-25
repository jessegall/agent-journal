<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Navigation\NavigationKey;
use App\Exceptions\MenuStepRefused;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One step of a menu library entry: the fingerprint of the screen it expects, and what it does there, a label to
 * choose when the main agent confirmed a menu entry or else a named key, with the text that proves it when it has
 * one. Arrow presses and screen text are never stored.
 */
#[MapName(SnakeCaseMapper::class)]
final class MenuStep extends Data
{
    private const string FINGERPRINT = '/^fp1:[0-9a-f]{64}$/';

    private const int MOST_TEXT_CHARACTERS = 200;

    public function __construct(
        public readonly string $fingerprint,
        public readonly string|null $choose,
        public readonly string|null $key,
        public readonly string|null $proof,
    ) {}

    /**
     * A step of a proven path as the host sent it: a fingerprint, exactly one of a label to choose or a named key, and
     * an optional proof; nothing else, so no screen text reaches the library.
     *
     * @param  array<string, mixed>  $sent
     *
     * @throws MenuStepRefused
     */
    public static function fromHost(int $index, array $sent): self
    {
        foreach (array_keys($sent) as $field) {
            if (! in_array($field, [
                'fingerprint',
                'choose',
                'key',
                'proof',
            ], true)) {
                throw MenuStepRefused::unexpectedField($index, (string) $field);
            }
        }

        $fingerprint = $sent['fingerprint'] ?? null;

        if (! is_string($fingerprint) || preg_match(self::FINGERPRINT, $fingerprint) !== 1) {
            throw MenuStepRefused::fingerprintMalformed($index);
        }

        $choose = self::text($index, $sent['choose'] ?? null);
        $key = self::text($index, $sent['key'] ?? null);

        if (($choose === null) === ($key === null)) {
            throw MenuStepRefused::notOneAction($index);
        }

        if ($key !== null && NavigationKey::tryFrom($key) === null) {
            throw MenuStepRefused::keyNotAllowed($index, $key);
        }

        return new self($fingerprint, $choose, $key, self::text($index, $sent['proof'] ?? null));
    }

    /**
     * @throws MenuStepRefused
     */
    private static function text(int $index, mixed $stepText): string|null
    {
        if ($stepText === null) {
            return null;
        }

        if (! is_string($stepText) || mb_strlen($stepText) > self::MOST_TEXT_CHARACTERS) {
            throw MenuStepRefused::textTooLong($index, self::MOST_TEXT_CHARACTERS);
        }

        return $stepText;
    }
}
