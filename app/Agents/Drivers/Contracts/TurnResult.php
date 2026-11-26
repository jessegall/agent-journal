<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Contracts;

use App\Values\ThreadTokens;
use App\Values\TurnEnd;
use App\Values\UsageCost;
use App\Values\UsageWindowReading;
use Carbon\CarbonImmutable;

/**
 * What one headless turn of a driver printed, read chunk by chunk as it arrives: the usage it reported as it went,
 * the conversation it named, and how it ended.
 */
interface TurnResult
{
    /**
     * Reads the bytes printed next and answers the usage they reported, in the order it was printed.
     *
     * @return list<UsageWindowReading|UsageCost|ThreadTokens>
     */
    public function read(string $bytes, CarbonImmutable $now): array;

    /**
     * The conversation the driver said the turn belongs to, which a later turn resumes; none when it named none.
     */
    public function conversation(): string|null;

    /**
     * The turn as the host saw it end: the exit code, the result read and why it ended badly.
     */
    public function end(int|null $exitCode, string|null $problem = null): TurnEnd;
}
