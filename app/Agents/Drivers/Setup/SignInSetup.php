<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup;

use App\Accounts\Contracts\SignInProtocol;
use App\Agents\Drivers\Setup\Contracts\AccountFirstRun;
use App\Agents\Drivers\Setup\Contracts\SignInEnvironment;
use App\Agents\Drivers\Setup\Contracts\SignInPreparation;

/**
 * How the sign-in runner runs a driver's driver: the setting that names it, its environment, its model check, its
 * sign-out, its sign-in methods (OAuth first) and what a folder needs before a run and after a sign-in.
 */
final readonly class SignInSetup
{
    /**
     * @param  class-string<SignInEnvironment>  $environment
     * @param  non-empty-list<string>  $signOut
     * @param  array<string, class-string<SignInProtocol>>  $methods  by sign-in method value
     * @param  list<class-string<SignInPreparation>>  $preparations
     * @param  list<string>  $credentialFiles  the folder's own sign-in files, removed at sign-out
     * @param  list<class-string<AccountFirstRun>>  $firstRuns
     */
    public function __construct(
        public string $executableSetting,
        public string $environment,
        public ModelCheck $modelCheck,
        public array $signOut,
        public array $methods,
        public array $preparations = [],
        public array $credentialFiles = [],
        public array $firstRuns = [],
    ) {}
}
