<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One page of a phase's tasks in their order, read after a cursor at the phase revision the reader asked with. When
 * the phase moved to another revision since, the page is the first one again and says so, so the reader starts the
 * phase over. The next cursor is there while more tasks follow.
 */
#[TypeScript]
final class PhaseTaskPageData extends Data
{
    /**
     * @param  list<PhaseTaskData>  $rows
     */
    public function __construct(
        public readonly string $phase,
        public readonly int $revision,
        public readonly bool $isRevisionChanged,
        public readonly string $after,
        #[DataCollectionOf(PhaseTaskData::class)]
        public readonly array $rows,
        public readonly string|Optional $nextAfter = new Optional(),
    ) {}
}
