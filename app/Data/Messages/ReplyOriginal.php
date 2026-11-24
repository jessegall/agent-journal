<?php

declare(strict_types=1);

namespace App\Data\Messages;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The message a reply answers, as the reply line shows it: who wrote it, as actor and name, and one line of its text.
 */
#[TypeScript]
final class ReplyOriginal extends Data
{
    /**
     * The most characters of the original's text the reply line carries; the line itself cuts it off sooner.
     */
    public const int EXCERPT_LIMIT = 200;

    public function __construct(
        public readonly string $actor,
        public readonly string $label,
        public readonly string $excerpt,
    ) {}
}
