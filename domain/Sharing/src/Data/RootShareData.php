<?php

declare(strict_types=1);

namespace Domain\Sharing\Data;

use App\Data\Support\OptionalOrMissing;
use Domain\Sharing\Enums\ShareState;
use Domain\Sharing\Models\Share;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A share or an open proposal of the record on its preview page, which a confirmed preview refreshes or approves.
 */
#[TypeScript]
final class RootShareData extends Data
{
    use OptionalOrMissing;

    public function __construct(
        public readonly string $id,
        public readonly int $number,
        public readonly ShareState $state,
    ) {}

    public static function fromShare(Share $share): self
    {
        return new self($share->id, $share->number, $share->state);
    }
}
