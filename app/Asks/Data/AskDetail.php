<?php

declare(strict_types=1);

namespace App\Asks\Data;

use App\Asks\Enums\AskResult;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One ask read on its own page, passively: its card, the version an answer must name, where it stands, and for a
 * merge ask the approval decision its holder may merge, which only the current holder of an open ask may use.
 */
#[TypeScript]
final class AskDetail extends Data
{
    /** @use \App\Web\Creation\Buildable<AskDetailFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = AskDetailFields::class;

    public function __construct(
        public readonly AskCard $card,
        public readonly int $version,
        public readonly AskResult $result,
        public readonly string $resultLabel,
    ) {}
}
