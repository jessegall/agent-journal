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
 * would not export, and the privacy revision rises each time the runtime's screen turns from public to shielded. The
 * stream names the sender that sent it, and its proof, rising per stream, proves the host alive until it expires; an
 * older host sends neither, and its frames prove nothing. Who holds the input, whether a take is being settled and
 * the prompt revision a browser writer's input must name come with every frame; a grant's own id never does. A
 * contained runtime's frames name their attachment and verified container, and a lost attachment whose container
 * still runs says so instead of ending.
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
        public readonly ?string $stream = null,
        public readonly int $proof = 0,
        public readonly ?string $expiresAt = null,
        public readonly ?string $inputOwner = null,
        public readonly bool $takePending = false,
        public readonly int $promptRevision = 0,
        public readonly ?string $attachment = null,
        public readonly ?string $containerInstance = null,
        public readonly bool $connectionLost = false,
    ) {}
}
