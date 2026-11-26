<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use Illuminate\Support\Str;

/**
 * The ULID a stack test's fixture subject goes by, made from its short name, so a test writes 'guide' or '42' and the
 * state and its reference agree on the same record id. A ULID given is kept as it is.
 */
final class SubjectIds
{
    private const string ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

    public static function of(string $name): string
    {
        if (Str::isUlid($name)) {
            return $name;
        }

        $digest = hash('sha256', $name);
        $characters = array_map(
            fn (int $at) => self::ALPHABET[hexdec($digest[$at].$digest[$at + 1]) % 32],
            range(0, 48, 2),
        );

        return '0'.implode('', $characters);
    }
}
