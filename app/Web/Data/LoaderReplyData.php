<?php

declare(strict_types=1);

namespace App\Web\Data;

use App\Web\Enums\LoaderStatus;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The answer to one loader call, carrying the call's token back: the reader's answer when it is ok, the message of
 * each field whose input was invalid, or nothing more when it is unavailable.
 */
#[TypeScript]
final class LoaderReplyData extends Data
{
    /**
     * @param  array<string, string>|Optional  $errors
     */
    public function __construct(
        public readonly string $token,
        public readonly LoaderStatus $status,
        public readonly Data|Optional $value = new Optional(),
        public readonly array|Optional $errors = new Optional(),
    ) {}

    public static function ok(string $token, Data $value): self
    {
        return self::from(['token' => $token, 'status' => LoaderStatus::Ok, 'value' => $value]);
    }

    /**
     * @param  array<string, string>  $errors  the message of each invalid field, by its name
     */
    public static function invalid(string $token, array $errors): self
    {
        return self::from(['token' => $token, 'status' => LoaderStatus::Invalid, 'errors' => $errors]);
    }

    public static function unavailable(string $token): self
    {
        return self::from(['token' => $token, 'status' => LoaderStatus::Unavailable]);
    }
}
