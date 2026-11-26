<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Data;

use App\Agents\Drivers\Enums\MarkTone;
use App\Agents\Drivers\Enums\SignInCodeDirection;
use App\Values\DriverFamily;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * How a page shows one driver family: its key, its name, the other names its records may hold, its mark as a
 * same-origin path with the way it is drawn, and which way its sign-in code travels.
 *
 * @method static static from(DriverFamily $family)
 */
#[TypeScript]
final class DriverLookData extends Data
{
    public function __construct(
        public readonly string $family,
        public readonly string $label,
        /** @var list<string> */
        public readonly array $aliases,
        public readonly string $markUrl,
        public readonly MarkTone $markTone,
        public readonly SignInCodeDirection $signInCode,
    ) {}

    public static function fromDriverFamily(DriverFamily $family): self
    {
        return new self(
            family: $family->key,
            label: $family->label,
            aliases: $family->aliases,
            markUrl: "/{$family->markAsset}",
            markTone: $family->markTone,
            signInCode: $family->signInCode,
        );
    }
}
