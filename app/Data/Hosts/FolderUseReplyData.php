<?php

declare(strict_types=1);

namespace App\Data\Hosts;

use Spatie\LaravelData\Data;

/**
 * The protected host's answer to whether a container binds an account folder, taken as bound when it does not say.
 */
final class FolderUseReplyData extends Data
{
    public function __construct(public readonly bool $isBound = true) {}
}
