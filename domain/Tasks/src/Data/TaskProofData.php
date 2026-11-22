<?php

declare(strict_types=1);

namespace Domain\Tasks\Data;

use App\Enums\ActorType;
use Domain\Tasks\Values\TaskProof;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One proof of a task as its Proofs tab lists it: the check, its run and producer, the process run it was bound to,
 * and its receipt and outcome once its result was published.
 */
#[TypeScript]
final class TaskProofData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $operation,
        public readonly int $runNumber,
        public readonly ActorType $producerType,
        public readonly string $producerId,
        public readonly string $processRunId,
        public readonly string $registeredAt,
        public readonly string|Optional $receiptId = new Optional(),
        public readonly string|Optional $outcome = new Optional(),
        public readonly string|Optional $boundAt = new Optional(),
    ) {}

    public static function fromTaskProof(TaskProof $proof): self
    {
        return self::from(array_filter([
            'id' => $proof->id,
            'operation' => $proof->operation,
            'runNumber' => $proof->runNumber,
            'producerType' => $proof->producerType,
            'producerId' => $proof->producerId,
            'processRunId' => $proof->processRunId,
            'registeredAt' => $proof->registeredAt->toIso8601String(),
            'receiptId' => $proof->receiptId,
            'outcome' => $proof->outcome,
            'boundAt' => $proof->boundAt?->toIso8601String(),
        ], fn (mixed $proofValue) => $proofValue !== null));
    }
}
