<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;

/**
 * The agent host's answer to making or removing an account folder: whether it did, and why not when it did not.
 */
final class AccountFolderReplyData extends Data
{
    public function __construct(
        public readonly bool $isDone = false,
        public readonly string $reason = '',
    ) {}
}
