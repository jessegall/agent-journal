<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup\Contracts;

/**
 * The variables a driver's driver reads its account from, for one account folder; the egress variables are added by
 * the sign-in driver itself.
 */
interface SignInEnvironment
{
    /**
     * @return array<string, string>
     */
    public function __invoke(string $directory): array;
}
