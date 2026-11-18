<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Exceptions\CommandDeclarationInvalid;
use Carbon\CarbonImmutable;

/**
 * How long a command's receipt answers a repeat, and how long after that its key stays refused. A command that
 * declares no RequiresRequestKey keeps its receipt 30 days and then forgets the key.
 */
final readonly class ReceiptRetention
{
    private const int STANDARD_DAYS = 30;

    private function __construct(public int $retentionDays, public int $tombstoneDays) {}

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

    public function answersUntil(CarbonImmutable $taken): CarbonImmutable
    {
        return $taken->addDays($this->retentionDays);
    }

    public function refusesUntil(CarbonImmutable $taken): CarbonImmutable
    {
        return $taken->addDays($this->tombstoneDays);
    }
}
