<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Enums\ProfileType;

/**
 * The project's override of every profile of one type; its denials are hard limits no profile removes.
 */
final readonly class TypeOverride
{
    public function __construct(
        public ProfileType $type,
        public PolicyOverride $override,
    ) {}
}
