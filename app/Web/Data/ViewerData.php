<?php

declare(strict_types=1);

namespace App\Web\Data;

use App\Web\Enums\ViewerType;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Who views the page: the type of viewer, the signed-in user's id (it keys what the browser keeps per user) and display
 * name, never a credential, and whether they may share records.
 */
#[TypeScript]
final class ViewerData extends Data
{
    public function __construct(
        public readonly ViewerType $type,
        public readonly string|Optional $id,
        public readonly string|Optional $name,
        public readonly bool $canShare,
    ) {}
}
