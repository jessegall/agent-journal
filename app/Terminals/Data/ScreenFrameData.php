<?php

declare(strict_types=1);

namespace App\Terminals\Data;

use App\Terminals\Enums\ScreenBuffer;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A runtime's screen as its host last captured it: its rows as styled runs, the cursor, the buffer and the size, with
 * who holds the input and the stream proof that the host is alive. A marker frame has no rows and says why; the rest is
 * described in docs/terminals/screen-frames.md.
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
        public readonly bool $isPlain,
        public readonly bool $isTooLarge,
        public readonly bool $isUnreadable,
        public readonly bool $hasNoTerminal,
        public readonly bool $isShielded = false,
        public readonly int $privacyRevision = 0,
        public readonly string|null $stream = null,
        public readonly int $proof = 0,
        public readonly string|null $expiresAt = null,
        public readonly string|null $inputOwner = null,
        public readonly bool $isTakePending = false,
        public readonly int $promptRevision = 0,
        public readonly string|null $attachment = null,
        public readonly string|null $containerInstance = null,
        public readonly bool $isConnectionLost = false,
        public readonly ScreenMenuData|Optional $menu = new Optional(),
    ) {}

    /**
     * The frame as the host reports it, each row the bare list of its runs, so from() reads it back the same.
     *
     * @return array<string, mixed>
     */
    public function asReported(): array
    {
        return [
            ...$this->toArray(),
            'rows' => array_map(
                fn (ScreenRowData $row) => array_map(fn (ScreenRunData $run) => $run->toArray(), $row->runs),
                $this->rows,
            ),
        ];
    }
}
