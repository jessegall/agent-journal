<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup;

use App\Agents\Drivers\Contracts\TurnResults;
use App\Agents\Exceptions\DriverSetupInvalid;

/**
 * How a driver runs its headless turns: each in a process of its own whose output a turn result reads, or all of an
 * account's turns on one owner process the account's runtimes share.
 */
final readonly class HeadlessTurns
{
    /**
     * @param  class-string<TurnResults>|null  $turnResults
     * @param  list<string>  $ownerArgv
     */
    private function __construct(private string|null $turnResults, public array $ownerArgv) {}

    /**
     * @param  class-string<TurnResults>  $results
     */
    public static function eachInAProcess(string $results): self
    {
        return new self($results, []);
    }

    /**
     * @param  non-empty-list<string>  $argv
     */
    public static function onAccountOwner(array $argv): self
    {
        return new self(null, $argv);
    }

    public function isOnAccountOwner(): bool
    {
        return $this->ownerArgv !== [];
    }

    /**
     * @return class-string<TurnResults>
     *
     * @throws DriverSetupInvalid
     */
    public function turnResults(string $family): string
    {
        return $this->turnResults ?? throw DriverSetupInvalid::noTurnProcess($family);
    }
}
