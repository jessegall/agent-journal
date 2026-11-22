<?php

declare(strict_types=1);

namespace App\Agents\Data;

use App\Agents\Enums\ScreenBuffer;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A runtime's screen as its host last captured it: every row as styled runs, the cursor, the buffer and the size,
 * numbered within the host process's epoch. A marker frame has no rows and says why: too large to send, unreadable,
 * or no terminal on the host; a plain frame dropped its styles to fit. A shielded frame stands for a screen its host
 * would not export, and the privacy revision rises each time the runtime's screen turns from public to shielded.
 */
#[TypeScript]
#[MapInputName(SnakeCaseMapper::class)]
final class ScreenFrameData extends Data
{
    /**
     * @param  list<ScreenRowData>  $rows
     */
    public function __construct(
        public readonly string $epoch,
        public readonly int $sequence,
        public readonly string $captured,
        public readonly int $columns,
        #[DataCollectionOf(ScreenRowData::class)]
        public readonly array $rows,
        public readonly ScreenCursorData $cursor,
        public readonly ScreenBuffer $buffer,
        public readonly bool $plain,
        public readonly bool $tooLarge,
        public readonly bool $unreadable,
        public readonly bool $noTerminal,
        public readonly bool $shielded = false,
        public readonly int $privacyRevision = 0,
    ) {}

    /**
     * Whether this frame comes after the other: from another host process, or later in the same one.
     */
    public function supersedes(self $other): bool
    {
        return $this->epoch !== $other->epoch || $this->sequence > $other->sequence;
    }
}
