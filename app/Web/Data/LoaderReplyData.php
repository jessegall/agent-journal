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
    public function __construct(
        public readonly string $token,
        public readonly LoaderStatus $status,
        public readonly Data|Optional $value,
        /** @var array<string, string>|Optional */
        public readonly array|Optional $errors,
    ) {}
}
