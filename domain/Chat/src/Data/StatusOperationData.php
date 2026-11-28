<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Support\StatusFollowedOperation;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The operation an agent's status follows: its id, what it is, its stage and the version a recovery names.
 *
 * @method static static from(array<string, mixed> $operation)
 */
#[TypeScript]
final class StatusOperationData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $type,
        public readonly string $stage,
        public readonly int $version,
    ) {}

    public static function fromStatusOperation(StatusFollowedOperation $operation): self
    {
        return self::from([
            'id' => $operation->id,
            'type' => $operation->type,
            'stage' => $operation->stage,
            'version' => $operation->version,
        ]);
    }
}
