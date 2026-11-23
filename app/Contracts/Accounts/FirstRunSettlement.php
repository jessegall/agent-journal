<?php

declare(strict_types=1);

namespace App\Contracts\Accounts;

/**
 * A sign-in whose driver asks a person questions on its first run in a folder, such as a welcome screen: the sign-in
 * service answers them once the folder is signed in, so a session never stops at one. The one place that may write a
 * driver's own first-run state (rule 81); the host's screen navigation knows the same screens.
 */
interface FirstRunSettlement
{
    /**
     * Leaves the signed-in folder past the driver's first-run questions; a folder already past them is left alone.
     */
    public function settleFirstRun(string $directory): void;
}
