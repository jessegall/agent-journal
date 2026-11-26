<?php

declare(strict_types=1);

namespace App\Connections\Data;

use App\Connections\Values\ReleaseTarget;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One platform of the current release as the window shows it: its measured bytes, the prerequisites the machine
 * needs, the providers it withholds and whether it is supported.
 */
#[TypeScript]
final class ReleaseTargetData extends Data
{
    /**
     * @param  list<string>  $prerequisites
     */
    public function __construct(
        public readonly string $name,
        public readonly int $bytes,
        public readonly bool $isMeasured,
        public readonly array $prerequisites,
        public readonly bool $isSupported,
    ) {}

    public static function fromTarget(ReleaseTarget $target): self
    {
        return self::from([
            'name' => $target->name,
            'bytes' => $target->bytes,
            'isMeasured' => $target->isMeasured,
            'prerequisites' => $target->prerequisites,
            'isSupported' => $target->isSupported(),
        ]);
    }
}
