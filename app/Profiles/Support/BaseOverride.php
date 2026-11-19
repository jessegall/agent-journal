<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Values\ProfileBase;

/**
 * The project's override of every profile that starts from one built-in base; its denials are hard limits no profile removes.
 */
final readonly class BaseOverride
{
    public function __construct(
        public ProfileBase $base,
        public PolicyOverride $override,
    ) {}
}
