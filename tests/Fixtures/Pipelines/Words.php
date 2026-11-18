<?php

declare(strict_types=1);

namespace Tests\Fixtures\Pipelines;

/**
 * A fixture stage: a text of words.
 */
final readonly class Words
{
    public function __construct(public string $text) {}
}
