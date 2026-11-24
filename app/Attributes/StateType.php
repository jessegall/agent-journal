<?php

declare(strict_types=1);

namespace App\Attributes;

use App\Enums\SessionTransferType;
use Attribute;

/**
 * A state's own type: the key its frames are saved under, the version of the values it saves, whether its frames carry
 * into the session that continues the work.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class StateType
{
    public function __construct(public string $key, public int $schemaVersion, public SessionTransferType $transfer) {}
}
