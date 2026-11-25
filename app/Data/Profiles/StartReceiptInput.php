<?php

declare(strict_types=1);

namespace App\Data\Profiles;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The request id the browser kept for a start whose reply was lost.
 */
#[TypeScript]
final class StartReceiptInput extends Data
{
    public function __construct(public readonly string $request) {}

    /**
     * @return array<string, list<string>>
     */
    public static function rules(): array
    {
        return ['request' => ['required', 'string', 'max:64']];
    }
}
