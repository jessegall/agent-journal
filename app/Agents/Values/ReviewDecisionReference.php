<?php

declare(strict_types=1);

namespace App\Agents\Values;

/**
 * Names one typed review decision, as the merge of approved work refers to it.
 */
final readonly class ReviewDecisionReference
{
    public function __construct(public string $id) {}
}
