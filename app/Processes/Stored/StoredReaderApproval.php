<?php

declare(strict_types=1);

namespace App\Processes\Stored;

use App\Processes\Values\ReaderApproval;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A reader approval as it is stored, the shape ReaderApproval::toArray writes: the reader revision and its proof.
 *
 * @method static array<int, static> collect(mixed $items) read only from decoded JSON, so always an array
 */
#[MapInputName(SnakeCaseMapper::class)]
final class StoredReaderApproval extends Data
{
    public function __construct(
        public readonly string $readerRevisionId,
        public readonly string $proofId,
    ) {}

    public function approval(): ReaderApproval
    {
        return new ReaderApproval($this->readerRevisionId, $this->proofId);
    }
}
