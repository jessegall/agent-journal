<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\RedirectType;

/**
 * One redirect of a command, in the order written: its descriptor, what it does, and its target word or here-document.
 */
final readonly class Redirect
{
    public function __construct(
        public int $descriptor,
        public RedirectType $type,
        public Word|HereDocument $target,
        public SourceRange $range,
    ) {}
}
