<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Api;

/**
 * One note as other owners see it.
 */
final readonly class NoteValue
{
    public function __construct(
        public string $id,
        public string $text,
    ) {}
}
