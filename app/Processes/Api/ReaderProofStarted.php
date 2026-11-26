<?php

declare(strict_types=1);

namespace App\Processes\Api;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * The proof a reader replay made, waiting on the owner.
 */
final class ReaderProofStarted extends Data
{
    public function __construct(
        #[MapName('proof_id')]
        public string $proofId,
        public string $state,
    ) {}
}
