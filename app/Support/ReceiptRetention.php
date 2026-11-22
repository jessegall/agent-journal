<?php

declare(strict_types=1);

namespace App\Support;

use App\Attributes\RequiresRequestKey;
use App\Attributes\RetainedActorRequestKey;
use App\Exceptions\CommandDeclarationInvalid;
use Carbon\CarbonImmutable;

/**
 * How long a command's receipt answers a repeat, and how long after that its key stays refused. A command that
 * declares no RequiresRequestKey keeps its receipt 30 days and then forgets the key.
 */
final readonly class ReceiptRetention
{
    private const int STANDARD_DAYS = 30;

    private function __construct(public int $retentionDays, public int|null $tombstoneDays) {}

    public static function standard(): self
    {
        return new self(self::STANDARD_DAYS, self::STANDARD_DAYS);
    }

    /**
     * @param  class-string  $command
     */
    public static function declaredBy(string $command, RequiresRequestKey $declaration): self
    {
        if ($declaration->retentionDays < 1 || $declaration->tombstoneDays < $declaration->retentionDays) {
            throw CommandDeclarationInvalid::for($command, 'RequiresRequestKey keeps a receipt at least a day and its tombstone no shorter than the receipt');
        }

        return new self($declaration->retentionDays, $declaration->tombstoneDays);
    }

    /**
     * The retention of a key kept for its actor: it answers for the given days and refuses for good after them.
     *
     * @param  class-string  $command
     */
    public static function retainedForActor(string $command, RetainedActorRequestKey $declaration): self
    {
        if ($declaration->answerDays < 1) {
            throw CommandDeclarationInvalid::for($command, 'RetainedActorRequestKey answers for at least a day');
        }

        return new self($declaration->answerDays, null);
    }

    public function answersUntil(CarbonImmutable $taken): CarbonImmutable
    {
        return $taken->addDays($this->retentionDays);
    }

    /**
     * The day the key may be used again; none for a key that stays refused for good.
     */
    public function refusesUntil(CarbonImmutable $taken): CarbonImmutable|null
    {
        return $this->tombstoneDays === null ? null : $taken->addDays($this->tombstoneDays);
    }
}
