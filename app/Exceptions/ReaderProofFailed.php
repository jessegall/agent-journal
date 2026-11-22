<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A reader could not be proven: the message names every failing check, with byte offsets where the output showed it,
 * and the exit statuses still lacking a real sample. The request stays awaiting proof.
 */
final class ReaderProofFailed extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    /**
     * @param  list<string>  $failures
     * @param  list<int>  $unprovenStatuses
     */
    private function __construct(
        string $message,
        public readonly array $failures,
        public readonly array $unprovenStatuses,
    ) {
        parent::__construct($message);
    }

    /**
     * @param  list<string>  $failures
     * @param  list<int>  $unprovenStatuses
     */
    public static function because(array $failures, array $unprovenStatuses): self
    {
        $lines = [...$failures];

        if ($unprovenStatuses !== []) {
            $lines[] = 'exit statuses without a sample: '.implode(', ', $unprovenStatuses);
        }

        return new self('The reader is not proven: '.implode('; ', $lines).'.', $failures, $unprovenStatuses);
    }

    public static function notAwaiting(string $nextStep): self
    {
        return new self("The request does not await a proof: {$nextStep}", [], []);
    }

    protected function status(): int
    {
        return 422;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
