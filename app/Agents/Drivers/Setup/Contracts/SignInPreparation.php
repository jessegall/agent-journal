<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup\Contracts;

/**
 * What an account folder needs before every run of a driver's driver, such as Codex's file credential store.
 */
interface SignInPreparation
{
    /**
     * Prepares the sign-in folder before the driver's sign-in process starts in it.
     */
    public function __invoke(string $directory): void;
}
