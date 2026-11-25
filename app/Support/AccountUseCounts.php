<?php

declare(strict_types=1);

namespace App\Support;

/**
 * How many running starts use each account asked about. An account nothing uses counts zero.
 */
final readonly class AccountUseCounts
{
    /**
     * @param  array<string, int>  $runningByAccount  keyed by the account's link alias and id
     */
    public function __construct(public array $runningByAccount = []) {}

    public function with(RecordIdentity $account, int $running): self
    {
        return new self([
            ...$this->runningByAccount,
            self::keyOf($account) => $running,
        ]);
    }

    public function runningFor(RecordIdentity $account): int
    {
        return $this->runningByAccount[self::keyOf($account)] ?? 0;
    }

    public function isEmpty(): bool
    {
        return array_sum($this->runningByAccount) === 0;
    }

    private static function keyOf(RecordIdentity $account): string
    {
        return "{$account->type} {$account->id}";
    }
}
