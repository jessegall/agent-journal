<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Contracts\RefusalDetails;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Bus\Values\RecoveryCall;
use App\Contracts\CommandRefusal;
use App\Records\Support\RecordIdentity;
use RuntimeException;

final class AssignmentRootFinished extends RuntimeException implements CodedRefusal, CommandRefusal, RefusalDetails
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

    public function refusalDetails(): array
    {
        return $this->recovery === null ? [] : ['next_action' => $this->recovery->toArray()];
    }

    /** @return array<string, mixed> */
    protected function details(): array
    {
        return $this->refusalDetails();
    }
}
