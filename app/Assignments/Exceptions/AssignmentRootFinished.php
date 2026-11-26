<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Contracts\Refusals\RefusalRecovery;
use App\Engine\Enums\RefusalCode;
use App\Support\RecordIdentity;
use App\Values\RecoveryCall;
use RuntimeException;

final class AssignmentRootFinished extends RuntimeException implements CodedRefusal, CommandRefusal, RefusalRecovery
{
    use RendersRefusal;

    private function __construct(string $message, private readonly RecoveryCall|null $recovery)
    {
        parent::__construct($message);
    }

    public static function for(RecordIdentity $root, RecoveryCall|null $recovery = null): self
    {
        return new self(
            sprintf(
                '%s %s is finished, so its work is not given out as a whole; assign single records instead.',
                $root->type,
                $root->id,
            ),
            $recovery,
        );
    }

    protected function status(): int
    {
        return 422;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }

    public function recovery(): RecoveryCall|null
    {
        return $this->recovery;
    }

    /**
     * @return array<string, mixed>
     */
    protected function details(): array
    {
        return RecoveryCall::detailsOf($this->recovery);
    }
}
