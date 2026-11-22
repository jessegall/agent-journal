<?php

declare(strict_types=1);

namespace App\Calls\Communication;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * Whether each notified member's runtime accepted a message's wake.
 */
final class WakeStatuses extends Data
{
    /**
     * @param  list<MemberWake>  $members
     */
    public function __construct(
        #[DataCollectionOf(MemberWake::class)]
        public array $members,
    ) {}
}
